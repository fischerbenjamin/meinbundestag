"""Processing of the speeches.

This module is used to post-process a speech. The current implementation
uses textblob to calculate the sentiment of the content.
"""


# Python imports
import logging
from typing import List, Tuple


# 3rd party modules
from textblob_de import TextBlobDE as TextBlob


# Local imports
import src.modules.schema as schema
import src.modules.myexceptions as myexceptions


def analyze_speeches(speeches: List[schema.Speech]) -> None:
    """Analyze multiple speeches at once.

    Args:
        speeches (List[schema.Speech]): list of speeches

    Raises:
        myexceptions.SpeechAnalysisException: if processing of a speech fails
            or None was passed as argument

    """
    if speeches is None:
        raise myexceptions.SpeechAnalysisException("Speeches were 'None'")
    for speech in speeches:
        try:
            __analyze_speech(speech)
        except Exception as exception:
            logging.error("Failed analyzing speech (id: %s)", speech.speech_id)
            logging.exception(exception)
            raise myexceptions.SpeechAnalysisException from exception


def __analyze_speech(speech: schema.Speech) -> None:
    """Analyze a single speech.

    This function updates the analysis attribute of the speech object.

    Args:
        speech (Speech): speech to analyze

    """
    polarity, subjectivity = __analyze_sentiment(speech.content)
    no_comments = __analyze_comments(speech.content)
    speech.analysis.update(
        polarity, subjectivity, no_comments
    )


def __analyze_sentiment(content: schema.SpeechContent) -> Tuple[float, float]:
    """Analyzises the sentiment of a speech.

    It returns a tuple describing if the text of the speech is rather
    positive/negative and subjective/objective.

    Args:
        content (schema.SpeechContent): content of the speech

    Returns:
        Tuple[float, float]: (polarity, subjectivity)

    """
    text = content.get_speakers_text()
    if not text:
        return (0.0, 0.5)
    blob = TextBlob(text)
    polarity, subjectivity = (
        float("{0:.2f}".format(blob.sentiment.polarity)),
        float("{0:.2f}".format(blob.sentiment.subjectivity))
    )
    return (polarity, subjectivity)


def __analyze_comments(content: schema.SpeechContent) -> int:
    """Analyzes the comments of a speech.

    This default implementation only returns their number.

    Args:
        content (schema.SpeechContent): content of the speech

    Returns:
        int: number of comments

    """
    comments = content.get_comments()
    return len(comments)
