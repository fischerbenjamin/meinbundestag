"""
@author: Benjamin Fischer

This module enables the communication with the mongo database that stores
the speeches of the parliament. It provides an interface for
requesting/inserting speeches. The suffix _t indicates test data.
"""


# Local imports
import src.modules.schema as schema


# Global imports
import pymongo


# Global variables
client = None
speeches = None
speeches_t = None


def init(host: str, port: int) -> bool:
    """Initialize the module.

    Args:
        host (str): host which is running the database
        port (int): port the database is running on

    Returns:
        bool: True if initialization was successful, False otherwise
    """
    global client, speeches, speeches_t
    client = pymongo.MongoClient(host, port)
    try:
        client.admin.command('ismaster')
    except pymongo.errors.ConnectionFailure:
        return False
    speeches = client.db.speeches
    speeches_t = client.db.speeches_t


def get_speeches_for_user(name: str, db_test: bool = False) -> list:
    """Return the speeches for a certain deputy.

    Args:
        name (str): deputy's name
        db_test (bool, optional): Use test collection. Defaults to False.

    Returns:
        list: deputy's speeches (of type schema.Speech)
    """
    my_speeches = __get_speeches_col(db_test)
    my_query = {"name": name}
    return list(my_speeches.find(my_query))


def insert_speech(speech: schema.Speech, db_test: bool = False) -> bool:
    """Insert a single speech into the database.

    Args:
        speech (schema.Speech): speech object to insert
        db_test (bool, optional): Use test collection. Defaults to False.

    Returns:
        bool: True if speech wasn't in database before, False otherwise
    """
    if __speech_exists(speech, db_test):
        return False
    my_speeches = __get_speeches_col(db_test)
    my_speeches.insert(repr(speech))
    return True


def insert_speeches(speeches: list, db_test: bool = False) -> bool:
    """Insert multiple speeches of type schema.Speech into the database.

    Args:
        speeches (list): list of speeches
        db_test (bool, optional): Use test collection. Defaults to False.

    Returns:
        bool: True if no speech was in database before, False otherwise
    """
    result = []
    for speech in speeches:
        result.append(insert_speech(speech, db_test))
    return all(result)


def clear_speaches(db_test: bool = False) -> None:
    """Clears the collection, e.g removes all speeches.

    Args:
        db_test (bool, optional): Use test collection. Defaults to False.
    """
    my_speeches = __get_speeches_col(db_test)
    my_speeches.drop()


def __speech_exists(speech: schema.Speech, db_test: bool = False) -> bool:
    """Checks if the given speech is already in the database.

    Args:
        speech (schema.Speech): speech to check
        db_test (bool, optional): Use test database. Defaults to False.

    Returns:
        bool: True if speech already exists, False otherwise
    """
    my_speeches = __get_speeches_col(db_test)
    my_query = {"speech_id": speech.speech_id}
    return my_speeches.find(my_query).count() > 0


def __get_speeches_col(db_test: bool) -> pymongo.collection.Collection:
    global speeches, speeches_t
    if speeches is None or speeches_t is None:
        raise Exception("Must call init() before using this module.")
    return speeches_t if db_test else speeches
