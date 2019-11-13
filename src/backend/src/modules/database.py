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


def init(host: str, port: int) -> bool:
    """Initialize the module.

    Args:
        host (str): host which is running the database
        port (int): port the database is running on

    Returns:
        bool: True if initialization was successful, False otherwise
    """
    global client, database, speeches
    client = pymongo.MongoClient(host=host, port=port)
    try:
        client.admin.command('ismaster')
    except pymongo.errors.ConnectionFailure:
        return False
    database = client["bundestag"]
    speeches = database["speeches"]
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
    global speeches
    return [x for x in speeches.find({}, {"_id": 0})]
