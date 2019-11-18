"""
@author: Benjamin Fischer

This module is used to post-process a speech. The current implementation
uses textblob to calculate the sentiment of the content.
"""


# Local imports
import src.modules.schema as schema
import src.modules.myexceptions as myexceptions


# Gobal imports
import logging
from typing import List
from textblob_de import TextBlobDE as TextBlob


def analyze_speeches(speeches: List[schema.Speech]) -> None:
    """Wrapper to analyze multiple speeches.

    Args:
        speeches (List[schema.Speech]): list of speeches

    Raises:
        myexceptions.SpeechAnalysisException: if processing a speech fails
    """
    for speech in speeches:
        try:
            __analyze_speech(speech)
        except Exception as e:
            logging.error("Failed analyzing speech (id: {})".format(
                speech.speech_id
            ))
            logging.exception(e)
            raise myexceptions.SpeechAnalysisException from e


def __analyze_speech(speech: schema.Speech) -> None:
    """Analysis of a speech. Updates the 'analysis' attribute of the speech
    object.

    Args:
        speech (Speech): speech to analyze
    """
    polarity, subjectivity = __analyze_sentiment(speech.content)
    no_comments = __analyze_comments(speech.content)
    speech.analysis.update(
        polarity, subjectivity, no_comments
    )


def __analyze_sentiment(content: schema.SpeechContent) -> tuple:
    """Analyzises the sentiment of a speech. It returns a tuple describing
    if the text of the speech is rather positive/negative and
    subjective/objective.

    Args:
        content (schema.SpeechContent): content of the speech

    Returns:
        tuple: (polarity, subjectivity)
    """
    text = content.get_speakers_text()
    blob = TextBlob(text)
    polarity, subjectivity = (
        float("{0:.2f}".format(blob.sentiment.polarity)),
        float("{0:.2f}".format(blob.sentiment.subjectivity))
    )
    return (polarity, subjectivity)


def __analyze_comments(content: schema.SpeechContent) -> int:
    """Analyzes the comments of a speech. Currently only returns their number.

    Args:
        content (schema.SpeechContent): content of the speech

    Returns:
        int: number of comments
    """
    comments = content.get_comments()
    return len(comments)
