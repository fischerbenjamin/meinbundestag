"""
@author: Benjamin Fischer
"""


# Local imports
import src.modules.myexceptions as myexceptions
import src.modules.config as config
import src.modules.schema as schema


# Global imports
from typing import Iterator
from os import path
from lxml import etree


def get_speeches(filepath: str) -> Iterator[schema.Speech]:
    """Parses given protocol and returns the single speeches.

    Args:
        filepath (str): absolute filepath of the .xml file.

    Raises:
        SpeechParsingException: parsing the speech failed

    Returns:
        Iterator[Speech]: Speech elements
    """
    if filepath is None or filepath == "":
        raise myexceptions.SpeechParsingException(
            "Filepath is '{}'".format(filepath)
        )
    if not __check_protocol(filepath):
        raise myexceptions.SpeechParsingException(
            "Failed parsing/validating protocol '{}'".format(filepath)
        )
    tree = etree.parse(filepath)
    root = tree.getroot()
    for sp in root.iter("rede"):
        try:
            speach = __parse_speech(root, sp)
        except:
            raise myexceptions.SpeechParsingException
        yield speach


def __parse_speech(
    root: etree._Element, speech: etree._Element
) -> schema.Speech:
    """Parses a single speech given as a tree element. The structure of the
    result is declared in 'schema.py'.

    Args:
        speech (etree._Element): speech element to parse

    Returns:
        Speech: result
    """
    speech_id, speaker_id, name, party = __get_speech_meta(speech)
    topic = __get_speech_topic(root, speaker_id)
    date = __get_speech_date(root)
    text, comments = __get_speech_contents(speech)
    return schema.Speech(
        name, party, topic, date, text, comments, speaker_id, speech_id
    )


def __get_speech_meta(speech: etree._Element) -> tuple:
    """Returns meta information about given speech such as IDs and names.

    Args:
        speech (etree._Element): speech to parse

    Returns:
        tuple: (ID(speech), ID(speaker), speaker's name, speaker's party)
    """
    speaker = speech.find(".//redner")
    speech_id = speech.attrib["id"]
    speaker_id = speaker.attrib["id"]
    name = "{} {}".format(
        speaker.find("./name/vorname").text,
        speaker.find("./name/nachname").text
    )
    try:
        party = speaker.find("./name/fraktion").text
    except AttributeError:
        party = speaker.find("./name/rolle/rolle_kurz").text
    return (
        speech_id, speaker_id, name, party
    )


def __get_speech_topic(root: etree._Element, speaker_id: str) -> str:
    """Returns the topic the search is related to.

    Args:
        root (etree._Element): root element of xml tree
        speaker_id (str): unique if of desired speaker

    Returns:
        str: topic of the agenda item the speech is related to
    """
    topic_text = root.find(
        ".//ivz-block//redner[@id = '{}']/../../../{}/{}".format(
            speaker_id, "ivz-eintrag", "ivz-eintrag-inhalt"
        )
    ).text
    try:
        topic = topic_text.split(":")[1].strip()
    except IndexError:
        topic = topic_text
    return topic


def __get_speech_date(root: etree._Element) -> str:
    """Simply returns the date the speech was held.

    Args:
        root (etree._Element): root element

    Returns:
        str: date
    """
    return root.find(
        ".//veranstaltungsdaten/datum"
    ).attrib["date"]


def __get_speech_contents(speech: etree._Element) -> tuple:
    """Returns the actual contents of the speech and its comments.

    Args:
        speech (etree._Element): speech

    Returns:
        tuple: (text, comments)
    """
    text = " ".join([x.text for x in speech.findall("p")[1:]])
    comments = [str(x.text) for x in speech.findall("kommentar")]
    return (text, comments)


def __check_protocol(filepath: str) -> bool:
    """Checks the existence and validity of the given protocol.

    Args:
        filepath (str): absolute path of the .xml file

    Returns:
        bool: True if it exists, False otherwise
    """
    return path.exists(filepath) and path.isfile(filepath) \
        and __validate_protocol(filepath)


def __validate_protocol(filepath: str) -> bool:
    """Checks if the given protocol matches the document type definition.

    Args:
        filename (str): absolute path of the .xml-file

    Returns:
        bool: True if it matches, False otherwise
    """
    dtd = etree.DTD(config.DTD_FILE)
    tree = etree.parse(filepath)
    return dtd.validate(tree)
