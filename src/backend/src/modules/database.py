"""
@author: Benjamin Fischer

This module enables the communication with the mongo database that stores
the speeches of the parliament. It provides an interface for
requesting/inserting speeches.
"""


# Local imports
import src.modules.schema as schema


# Global imports
import logging
import pymongo
import threading


# Global variables
client = None
database = None
speeches = None
protocols = None
updater_event = None
scraper_event = None


def init(
    host: str, port: int,
    event_updater: threading.Semaphore, event_sracper: threading.Semaphore
) -> bool:
    """Initialize the module.

    Args:
        host (str): host which is running the database
        port (int): port the database is running on

    Returns:
        bool: True if initialization was successful, False otherwise
    """
    global client, database, speeches, protocols
    global updater_event, scraper_event
    client = pymongo.MongoClient(host=host, port=port)
    try:
        client.admin.command('ismaster')
    except pymongo.errors.ConnectionFailure:
        return False
    database = client["bundestag"]
    speeches = database["speeches"]
    protocols = database["protocols"]
    updater_event = event_updater
    scraper_event = event_sracper
    return True


def get_speeches_for_user(name: str) -> list:
    """Return the speeches for a certain deputy.

    Args:
        name (str): deputy's name

    Returns:
        list: deputy's speeches (of type schema.Speech)
    """
    global speeches
    import re
    regx = re.compile(
        "(.)*".join(name.split("-")), re.IGNORECASE
    )
    query = {"name": regx}
    view = {"_id": 0}
    return list(speeches.find(query, view))


def insert_speech(speech: schema.Speech) -> bool:
    """Insert a single speech into the database.

    Args:
        speech (schema.Speech): speech object to insert

    Returns:
        bool: True if speech wasn't in database before, False otherwise
    """
    global speeches, updater_event
    if __speech_exists(speech):
        return False
    speeches.insert(speech.to_json())
    return True


def insert_speeches(speeches: list) -> bool:
    """Insert multiple speeches of type schema.Speech into the database.

    Args:
        speeches (list): list of speeches

    Returns:
        bool:   True if no given speech was in the database before,
                False otherwise
    """
    result = []
    for speech in speeches:
        result.append(insert_speech(speech))
    failed = len([ret for ret in result if not ret])
    if failed > 0:
        logging.warning("Failed inserting {}/{} speeches.".format(
            failed, len(result)
        ))
        return False
    logging.info("Inserted {} speeches successfully.".format(len(result)))
    return True


def clear() -> None:
    """
    Clears the database, e.g removes all collections.
    """
    global client, database, speeches, protocols
    client.drop_database("bundestag")
    database = client["bundestag"]
    speeches = database["speeches"]
    protocols = database["protocols"]
    return True


def __speech_exists(speech: schema.Speech) -> bool:
    """Checks if the given speech is already in the database.

    Args:
        speech (schema.Speech): speech to check

    Returns:
        bool: True if speech already exists, False otherwise
    """
    global speeches
    my_query = {"speech_id": speech.speech_id}
    return speeches.find(my_query).count() > 0


def show() -> dict:
    """
    Returns all speeches in the database.

    Returns:
        list: speeches
    """
    global client, database, speeches, protocols
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


def insert_protocol(protocol: schema.Protocol) -> bool:
    global protocols
    if __protocol_exists(protocol):
        return False
    protocols.insert(protocol.to_json())
    logging.info("Inserted protocol '{}' successfully.".format(protocol.fname))
    updater_event.release()
    return True


def __protocol_exists(protocol: schema.Protocol) -> bool:
    global protocols
    my_query = {"url": protocol.url}
    return protocols.find(my_query).count() > 0


def protocol_is_done(protocol: schema.Protocol) -> bool:
    global protocols
    query = {"url": protocol.url}
    update = {"$set": {"done": True}}
    update_result = protocols.update_one(query, update)
    if not update_result.acknowledged or update_result.modified_count <= 0:
        logging.warning("Failed updating protocol '{}'.".format(
            protocol.fname
        ))
        return False
    logging.info("Updated protocol '{}' successfully.".format(protocol.fname))
    return True


def get_protocol_to_process() -> schema.Protocol:
    """Retrieve the next work item.

    Returns:
        str: url of the procotol to process next
    """
    global protocols, scraper_event
    query = {"done": False}
    obj = protocols.find_one(query)
    try:
        name = obj["fname"]
    except TypeError:
        name = "None"
    logging.info("Requested protocol '{}' to process.".format(name))
    if obj is None:
        scraper_event.release()
        return None
    return schema.Protocol.from_json(obj)


def get_all_protocols(query: dict) -> list:
    global protocols
    return list(protocols.find(query))


def get_all_speakers() -> list:
    global speeches
    speakers = set(x["name"] for x in speeches.find({}, {"_id": 0, "name": 1}))
    mapping = {}
    for speaker in speakers:
        mapping[speaker] = "{}/speeches/{}".format(
            "localhost:3000", speaker.lower().replace(" ", "-")
        )
    return mapping
