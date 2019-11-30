"""Interface for communication with the MongoDB database.

This module enables the communication with the MongodDB database.
It provides an interface for requesting/inserting speeches and protocol links
as well as some statistics about the content of the database.

The database 'bundestag' is used to save the data. It consists of two
collections 'protocols' and 'speeches' that contain the protocol links and
processed speeches in respective.

By convention, three different prefixes are used. The prefix 'speech'
indicates that the method is using the collection 'speeches' whereas the
prefix 'protocol' is used for methods that use the 'protocols' collection.
Methods with the prefix 'meta' may use both collection in order to calculate
statistics and meta information.
"""


# Python imports
import re
import logging
import threading
from typing import List, Union, Dict, Any, Tuple


# 3rd party modules
import pymongo


# Local imports
import src.modules.schema as schema
import src.modules.myexceptions as myexceptions


class Database:
    """Implementation of the database client.

    It uses the pymongo module inorder to communicate with the database.
    """

    def __init__(
            self, database_config: Tuple[str, int, bool, str, str],
            updater_event: threading.Semaphore,
            scraper_event: threading.Semaphore,
    ):
        """Initialize an Database object.

        Args:
            database_config (Tuple[str, int, bool]):
                (host, port, clear, user, password)
            updater_event (threading.Semaphore): signaling updater thread
            scraper_event (threading.Semaphore): signaling scraper thread

        Raises:
            myexceptions.DatabaseInitException: failed connection to database

        """
        host, port, clear_db, user, password = database_config
        self.client = pymongo.MongoClient(
            host=host, port=port, username=user, password=password
        )
        try:
            self.client.admin.command('ismaster')
        except pymongo.errors.ConnectionFailure:
            raise myexceptions.DatabaseInitException
        self.database = self.client["bundestag"]
        self.speeches = self.database["speeches"]
        self.protocols = self.database["protocols"]
        self.updater_event = updater_event
        self.scraper_event = scraper_event
        if clear_db:
            self.clear()
            logging.info("Cleared database before startup")

    def __del__(self):
        """Close the client connection on deletion."""
        self.client.close()

    def clear(self) -> None:
        """Clear the entire 'bundestag' database."""
        self.client.drop_database("bundestag")
        self.database = self.client["bundestag"]
        self.speeches = self.database["speeches"]
        self.protocols = self.database["protocols"]

    def speech_insert(self, speech: schema.Speech) -> bool:
        """Insert a speech into the database.

        This method inserts a single speech into the database. It is safe
        to call from other modules but there is also a wrapper method to
        insert multiple speeches at once.

        Args:
            speech (schema.Speech): speech object to insert

        Returns:
            bool: True if speech has not been added yet, False otherwise

        """
        exist = self.speeches.find({"speech_id": speech.speech_id}).count() > 0
        if exist:
            return False
        self.speeches.insert(speech.to_json())
        return True

    def speech_insert_collection(self, speeches: List[schema.Speech]) -> bool:
        """Insert a list of speeches into the database.

        Wrapper method for inserting multiple speeches at once into the
        database. Internally uses 'speech_insert' to insert a single speech
        of the given list.

        Args:
            speeches (List[schema.Speech]): list of speeches

        Returns:
            bool: True if all speeches were added successfully, False otherwise

        """
        result = [self.speech_insert(speech) for speech in speeches]
        failed = len([ret for ret in result if not ret])
        if failed > 0:
            logging.warning(
                "Failed inserting %d/%d speeches.", failed, len(result)
            )
            return False
        logging.info("Inserted %d speeches successfully.", len(result))
        return True

    def speech_get_speeches_for_name(
            self, name: re.Pattern, want_json: bool = True
    ) -> Union[List[schema.Speech], List[Dict[str, Any]]]:
        """Return all speeches of given deputy.

        This function returns all speeches for the given deputy.
        The caller may specify whether he wants the data as an json or object
        data.

        Args:
            name (re.Pattern): regex pattern for name
            want_json (bool, optional): json or object data. Defaults to True.

        Returns:
            Union[List[schema.Speech], List[Dict[str, Any]]]: speeches

        """
        speeches_json = self.speeches.find({"meta.name": name}, {"_id": 0})
        if want_json:
            return list(speeches_json)
        return list(schema.Speech.from_json(sp) for sp in speeches_json)

    def protocol_insert(self, protocol: schema.Protocol) -> bool:
        """Insert a single protocol into the database.

        Insert a protocol into the database. The updater thread will eventually
        ask for new protocols to process them.

        Args:
            protocol (schema.Protocol): protocol to insert

        Returns:
            bool: True if protocol has not been added before, False otherwise

        """
        exists = self.protocols.find({"url": protocol.url}).count() > 0
        if exists:
            return False
        self.protocols.insert(protocol.to_json())
        logging.info("Inserted protocol %s.", protocol.fname)
        self.updater_event.release()
        return True

    def protocol_get_all(self, query: dict) -> List[schema.Protocol]:
        """Return all protocol that fulfill the given query.

        By default, all protocols are returned but the caller can pass an
        additional query to filter the result.

        Args:
            query (dict, optional): query to apply.

        Returns:
            List[schema.Protocol]: protocols that fulfill the query

        """
        return list(
            schema.Protocol.from_json(p) for p in self.protocols.find(query)
        )

    def protocol_is_done(self, protocol: schema.Protocol) -> bool:
        """Mark the given protocol as processed in the database.

        Processed protocols must be tagged as done so the updater thread will
        not process the same protocol multiple times.

        Args:
            protocol (schema.Protocol): protocol to mark as done

        Returns:
            bool: True if update was successful, False otherwise

        """
        update_result = self.protocols.update_one(
            {"url": protocol.url}, {"$set": {"done": True}}
        )
        if not update_result.acknowledged or update_result.modified_count <= 0:
            logging.warning("Failed updating protocol %s", protocol.fname)
            return False
        logging.info("Updated protocol %s", protocol.fname)
        return True

    def protocol_get_next(self) -> schema.Protocol:
        """Return the next protocol to process.

        Returns the next protocol to process or None if all protocols are
        already tagged as done. If this is the case, the scraper thread is
        released again.

        Returns:
            schema.Protocol: next protocol to process or None

        """
        obj = self.protocols.find_one({"done": False})
        if obj is None:
            logging.info("No protocol to process found. Releasing scraper.")
            self.scraper_event.release()
            return None
        logging.info("Requested protocol %s to process", obj["fname"])
        return schema.Protocol.from_json(obj)

    def meta_stats(self) -> Dict[str, Union[int, List[str]]]:
        """Return general information about the database.

        Collects information such as database/collection names, number of
        speeches, etc.

        Returns:
            Dict[str, Union[int, List[str]]]: information about database

        """
        res = {
            "databases": [],
            "collections": [],
            "speeches": 0,
            "protocols": {
                "done": 0,
                "in_progress": 0,
                "total": 0
            }
        }
        res["databases"] = list(self.client.list_database_names())
        res["collections"] = list(self.database.collection_names())
        res["speeches"] = len(list(self.speeches.find()))
        res["protocols"]["total"] = len(list(self.protocols.find()))
        res["protocols"]["done"] = len(
            list(self.protocols.find({"done": True}))
        )
        res["protocols"]["in_progress"] = res["protocols"]["total"] \
            - res["protocols"]["done"]
        return res

    def meta_get_all_speakers(self) -> Dict[str, Union[List[str], int]]:
        """Return the names of all speakers who are present in the database.

        Returns:
            Dict[str, Union[List[str], int]]: names of deputies

        """
        speakers = list(set(
            x["meta"]["name"]
            for x in self.speeches.find({}, {"_id": 0, "meta": 1})
        ))
        return dict(names=speakers, total=len(speakers))

    def meta_get_analysis_limits(self) -> Dict[str, Any]:
        """Return the limits of the analysis of all speeches in the database.

        The limits can be useful for classifying a single speech as rather
        negative/positive or subjective/objective.

        Returns:
            Dict[str, Any]: description and its corresponding values

        """
        speeches = list(self.speeches.find({}, {"_id": 0}))
        if len(speeches) <= 0:
            return None
        polarity = [
            speech["analysis"]["polarity"] for speech in speeches
        ]
        subjectivity = [
            speech["analysis"]["subjectivity"] for speech in speeches
        ]
        comment = [
            speech["analysis"]["number_of_comments"] for speech in speeches
        ]
        polarity_limits = dict(
            desc="-1.0 (negative) ; 1.0 (positive)",
            min=min(polarity), max=max(polarity))
        subjectivity_limits = dict(
            desc="0.0 (objective) ; 1.0 (subjective)",
            min=min(subjectivity), max=max(subjectivity)
        )
        comment_limits = dict(
            desc="Number of comments during a speech",
            min=min(comment), max=max(comment)
        )
        return dict(
            total=len(speeches),
            polarity=polarity_limits,
            subjectivity=subjectivity_limits,
            number=comment_limits
        )
