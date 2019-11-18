"""
@author: Benjamin Fischer

This module enables the communication with the mongo database that stores
the speeches of the parliament. It provides an interface for
requesting/inserting speeches.
"""


# Local imports
import src.modules.schema as schema
import src.modules.myexceptions as myexceptions


# Global imports
import re
from typing import List, Union
import logging
import pymongo
import threading


class Database:

    def __init__(
        self, host: str, port: int,
        event_updater: threading.Semaphore, event_sracper: threading.Semaphore
    ):
        global client, database, speeches, protocols
        global updater_event, scraper_event
        self.client = pymongo.MongoClient(host=host, port=port)
        try:
            self.client.admin.command('ismaster')
        except pymongo.errors.ConnectionFailure:
            raise myexceptions.DatabaseInitException
        self.database = self.client["bundestag"]
        self.speeches = self.database["speeches"]
        self.protocols = self.database["protocols"]
        self.updater_event = event_updater
        self.scraper_event = event_sracper

    def __del__(self):
        self.client.close()

    def get_speeches_for_user(
        self, name: str, want_json: bool = True
    ) -> Union[List[schema.Speech], List[dict]]:
        regx = re.compile(
            "(.)*".join(name.split("-")), re.IGNORECASE
        )
        query = {"name": regx}
        view = {"_id": 0}
        speech_dicts = list(self.speeches.find(query, view))
        if want_json:
            return speech_dicts
        return list(
            schema.Speech.from_json(speech_dict)
            for speech_dict in speech_dicts
        )

    def __insert_speech(self, speech: schema.Speech) -> bool:
        if self.__speech_exists(speech):
            return False
        self.speeches.insert(speech.to_json())
        return True

    def insert_speeches(self, speeches: List[schema.Speech]) -> bool:
        result = [
            self.__insert_speech(speech) for speech in speeches
        ]
        failed = len([ret for ret in result if not ret])
        if failed > 0:
            logging.warning("Failed inserting {}/{} speeches.".format(
                failed, len(result)
            ))
            return False
        logging.info("Inserted {} speeches successfully.".format(len(result)))
        return True

    def clear(self) -> None:
        self.client.drop_database("bundestag")
        self.database = self.client["bundestag"]
        self.speeches = self.database["speeches"]
        self.protocols = self.database["protocols"]

    def __speech_exists(self, speech: schema.Speech) -> bool:
        """Checks if the given speech is already in the database.

        Args:
            speech (schema.Speech): speech to check

        Returns:
            bool: True if speech already exists, False otherwise
        """
        my_query = {"speech_id": speech.speech_id}
        return self.speeches.find(my_query).count() > 0

    def info(self) -> dict:
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
        res["databases"] = list(client.list_database_names())
        res["collections"] = list(database.collection_names())
        res["speeches"] = len(list(speeches.find()))
        res["protocols"]["total"] = len(list(protocols.find()))
        res["protocols"]["done"] = len(list(protocols.find({"done": True})))
        res["protocols"]["in_progress"] = res["protocols"]["total"] \
            - res["protocols"]["done"]
        return res

    def insert_protocol(self, protocol: schema.Protocol) -> bool:
        if self.__protocol_exists(protocol):
            return False
        self.protocols.insert(protocol.to_json())
        logging.info(
            "Inserted protocol '{}' successfully.".format(protocol.fname)
        )
        self.updater_event.release()
        return True

    def __protocol_exists(self, protocol: schema.Protocol) -> bool:
        my_query = {"url": protocol.url}
        return self.protocols.find(my_query).count() > 0

    def protocol_is_done(self, protocol: schema.Protocol) -> bool:
        query = {"url": protocol.url}
        update = {"$set": {"done": True}}
        update_result = self.protocols.update_one(query, update)
        if not update_result.acknowledged or update_result.modified_count <= 0:
            logging.warning("Failed updating protocol '{}'.".format(
                protocol.fname
            ))
            return False
        logging.info(
            "Updated protocol '{}' successfully.".format(protocol.fname)
        )
        return True

    def get_protocol_to_process(self) -> schema.Protocol:
        query = {"done": False}
        obj = self.protocols.find_one(query)
        try:
            name = obj["fname"]
        except TypeError:
            name = "None"
        logging.info("Requested protocol '{}' to process.".format(name))
        if obj is None:
            self.scraper_event.release()
            return None
        return schema.Protocol.from_json(obj)

    def get_all_protocols(self, query: dict) -> List[schema.Protocol]:
        return list(
            schema.Protocol.from_json(protocol_dict)
            for protocol_dict in self.protocols.find(query)
        )

    def get_all_speakers(
        self, host: str = "localhost", port: int = 3000
    ) -> dict:
        speakers = set(
            x["name"] for x in self.speeches.find({}, {"_id": 0, "name": 1})
        )
        mapping = {}
        for speaker in speakers:
            mapping[speaker] = "{}:{}/speeches/{}".format(
                host, port, speaker.lower().replace(" ", "-")
            )
        return mapping
