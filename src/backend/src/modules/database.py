"""
@author: Benjamin Fischer

This module enables the communication with the mongo database that stores
the speeches of the parliament. It provides an interface for
requesting/inserting speeches.
"""


# Local imports
import src.modules.schema as schema


# Global imports
import pymongo


# Global variables
client = None
database = None
speeches = None
protocols = None


def init(host: str, port: int) -> bool:
    """Initialize the module.

    Args:
        host (str): host which is running the database
        port (int): port the database is running on

    Returns:
        bool: True if initialization was successful, False otherwise
    """
    global client, database, speeches, protocols
    client = pymongo.MongoClient(host=host, port=port)
    try:
        client.admin.command('ismaster')
    except pymongo.errors.ConnectionFailure:
        return False
    database = client["bundestag"]
    speeches = database["speeches"]
    protocols = database["protocols"]
    return True


def get_speeches_for_user(name: str) -> list:
    """Return the speeches for a certain deputy.

    Args:
        name (str): deputy's name

    Returns:
        list: deputy's speeches (of type schema.Speech)
    """
    global speeches
    my_query = {"name": name}
    return list(speeches.find(my_query))


def insert_speech(speech: schema.Speech) -> bool:
    """Insert a single speech into the database.

    Args:
        speech (schema.Speech): speech object to insert

    Returns:
        bool: True if speech wasn't in database before, False otherwise
    """
    global speeches
    if __speech_exists(speech):
        return False
    speeches.insert(speech.__dict__)
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
    return all(result)


def clear_speaches() -> None:
    """
    Clears the collection, e.g removes all speeches.
    """
    global speeches
    speeches.drop()


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


def list_speeches() -> list:
    """
    Returns all speeches in the database.

    Returns:
        list: speeches
    """
    global speeches
    return [x for x in speeches.find({}, {"_id": 0})]


def insert_protocol(protocol: schema.Protocol) -> bool:
    global protocols
    if __protocol_exists(protocol):
        return False
    protocols.insert(protocol.__dict__)
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
    if not update_result.acknowledged:
        return False
    return update_result.modified_count > 0


def get_protocol_to_process() -> schema.Protocol:
    """Retrieve the next work item.

    Returns:
        str: url of the procotol to process next
    """
    global protocols
    query = {"done": False}
    obj = protocols.find_one(query)
    return schema.Protocol.init_from_dict(obj)


def get_all_protocols(query: dict, view: dict) -> list:
    global protocols
    return list(protocols.find(query, view))
