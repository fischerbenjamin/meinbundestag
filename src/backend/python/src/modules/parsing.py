"""Parsing speeches from the procotols of the Bundestag.

This module implements the parsing of the protocols provided by the Bundestag.
It uses the lxml module in order to parse the xml structure correctly and
coverts the content to predefined objects.
"""


# Python imports
import os
import logging
from typing import List, Tuple


# 3rd party modules
import lxml.etree


# Local imports
import src.modules.schema as schema
import src.modules.myexceptions as myexceptions


def get_speeches(filepath: str, dtd_file: str) -> List[schema.Speech]:
    """Parse the given file according to the given DTD.

    Parses the protocol and returns the single speeches. This is the only
    function in this module that is safe to be called from outside.

    Args:
        filepath (str): absolute filepath of the protocol

    Raises:
        SpeechParsingException: if parsing the speeches fail in any kind

    Returns:
        List[schema.Speech]: list of speech elements of the protocol

    """
    if filepath is None or filepath == "" or not __check_protocol(filepath):
        raise FileNotFoundError("Invalid filepath '{}'".format(filepath))
    if not __validate_protocol(filepath, dtd_file):
        logging.error("Failed validating %s", filepath)
        raise myexceptions.SpeechParsingException
    try:
        tree = lxml.etree.parse(filepath)
        root = tree.getroot()
        speeches = []
        for speech_elem in root.findall(".//tagesordnungspunkt/rede"):
            speech = __parse_speech(root, speech_elem)
            if speech is None:
                logging.warning(
                    "Skipping speech in %s. Invalid content", filepath
                )
            else:
                if speech.assert_is_relevant():
                    speeches.append(speech)
    except Exception as exception:
        raise myexceptions.SpeechParsingException from exception
    return speeches


def __parse_speech(
        root: lxml.etree.ElementBase, speech: lxml.etree.ElementBase
) -> schema.Speech:
    """Parse a single speech given as a tree element.

    Args:
        speech (lxml.etree.ElementBase): speech element to parse

    Returns:
        Speech: parsed speech

    """
    speech_id, speaker_id, name, party = __get_speech_meta(speech)
    topic = __get_speech_topic(root, speaker_id)
    date = __get_speech_date(root)
    content = __get_speech_contents(speech)
    if not content.assert_valid():
        return None
    meta = dict(
        name=name, party=party, topic=topic, date=date
    )
    return schema.Speech(
        meta, content, speaker_id, speech_id
    )


def __get_speech_meta(
        speech: lxml.etree.ElementBase
) -> Tuple[str, str, str, str]:
    """Return the meta information about the speech.

    Meta information are for example the name of speaker or the IDs.

    Args:
        speech (lxml.etree.ElementBase): speech to parse

    Returns:
        Tuple[str, str, str, str]: (ID(speech), ID(speaker), name, party)

    """
    speaker = speech.find(".//redner")
    speech_id = speech.attrib["id"]
    speaker_id = speaker.attrib["id"]
    try:
        firstname = speaker.find("./name/vorname").text
    except AttributeError:
        firstname = "n.a"
    try:
        lastname = speaker.find("./name/nachname").text
    except AttributeError:
        lastname = "n.a"
    name = "{} {}".format(firstname, lastname)
    try:
        party = speaker.find("./name/fraktion").text
    except AttributeError:
        party = speaker.find("./name/rolle/rolle_kurz").text
    return (speech_id, speaker_id, name, party)


def __get_speech_topic(root: lxml.etree.ElementBase, speaker_id: str) -> str:
    """Return the topic of the speaker's speech.

    The layout of the topic's description is not defined so the result may not
    always be satisfying.

    Args:
        root (lxml.etree.ElementBase): root element of xml tree
        speaker_id (str): unique ID of desired speaker

    Returns:
        str: topic of the agenda item the speech is related to

    """
    topic = root.find(".//ivz-block//redner[@id = '{}']/../../../{}/{}".format(
        speaker_id, "ivz-eintrag", "ivz-eintrag-inhalt"
    ))
    try:
        text = topic.text.split(":")[1].strip()
    except IndexError:
        text = topic.text
    except AttributeError:
        text = "None"
    return text


def __get_speech_date(root: lxml.etree.ElementBase) -> str:
    """Return the date the speech was held.

    Args:
        root (lxml.etree.ElementBase): root element

    Returns:
        str: date

    """
    return root.find(
        ".//veranstaltungsdaten/datum"
    ).attrib["date"]


def __get_speech_contents(
        speech: lxml.etree.ElementBase
) -> schema.SpeechContent:
    """Return the content of the speech in a procedural manner.

    This function is probably the most complex one. It creates the speech
    content which requires to collect subsequent paragraphs of one speaker and
    seperate them from the paragraphs of the other speakers.

    Args:
        speech (lxml.etree.ElementBase): speech to parse

    Returns:
        schema.SpeechContent: the sequential content of the speech

    """
    speech_content = schema.SpeechContent([])
    name_flow = [
        schema.SpeechIndex(speech.index(e), e.text.replace(":", ""))
        for e in speech if e.tag == "name"
    ]
    redner_flow = [
        schema.SpeechIndex(speech.index(e), "{} {} ({})".format(
            e.find(".//redner/name/vorname").text
            if e.find(".//redner/name/vorname") is not None else "n.a",
            e.find(".//redner/name/nachname").text
            if e.find(".//redner/name/nachname") is not None else "n.a",
            e.find(".//redner/name/fraktion").text
            if e.find(".//redner/name/fraktion") is not None else ""
        ))
        for e in speech
        if e.tag == "p" and "klasse" in e.attrib.keys()
        and e.attrib["klasse"] == "redner"
    ]
    speech_flow = sorted(name_flow + redner_flow, key=lambda x: x.index)
    speaker = speech_flow[0]
    for counter, curr_speech_index in enumerate(speech_flow):
        try:
            speech_index_start = curr_speech_index
            speech_index_end = speech_flow[counter+1].index
        except IndexError:
            speech_index_end = len(speech)
        is_speaker = (speech_index_start.name == speaker.name)
        paragraphs = speech[(speech_index_start.index+1):speech_index_end]
        speech_entry = schema.SpeechEntry(
            speech_index_start.name, is_speaker, []
        )
        for para in paragraphs:
            if para.text is None:
                continue
            if para.tag == "kommentar":
                speech_paragraph = schema.SpeechParagraph(
                    schema.SpeechParagraph.TYPE_COMMENT,
                    para.text.replace("(", "").replace(")", "")
                )
            if para.tag == "p" and para.attrib != "redner":
                speech_paragraph = schema.SpeechParagraph(
                    schema.SpeechParagraph.TYPE_SPEECH,
                    para.text
                )
            speech_entry.add_paragraph(speech_paragraph)
        if len(speech_entry.paragraphs) != 0:
            speech_content.add_speech_entry(speech_entry)
    return speech_content


def __check_protocol(filepath: str) -> bool:
    """Check the existence and validity of the given protocol.

    This function simply checks if the path exists and if the path is a file.

    Args:
        filepath (str): absolute path of the .xml file

    Returns:
        bool: True if it exists, False otherwise

    """
    return os.path.exists(filepath) and os.path.isfile(filepath)


def __validate_protocol(filepath: str, dtd_file: str) -> bool:
    """Check if the given protocol matches the document type definition.

    Args:
        filename (str): absolute path of the .xml file

    Returns:
        bool: True if it matches, False otherwise

    """
    dtd = lxml.etree.DTD(dtd_file)
    tree = lxml.etree.parse(filepath)
    return dtd.validate(tree)
