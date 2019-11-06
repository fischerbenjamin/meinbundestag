"""
@author: Benjamin Fischer
"""


# Local imports
import src.modules.schema as schema


# Gobal imports
from textblob_de import TextBlobDE as TextBlob


def analyze(speech: schema.Speech) -> None:
    """Analysis of a speech. Updates the 'analysis' attribute of the speech
    object.

    Args:
        speech (Speech): speech to analyze
    """
    polarity, subjectivity = __analyze_sentiment(speech.text)
    no_comments = __analyze_comments(speech.comments)
    speech.analysis = {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "no_comments": no_comments
    }


def __analyze_sentiment(text: str) -> tuple:
    """Returns the polarity and subjectivity of the speech.

    Args:
        text (str): spoken text of the speech

    Returns:
        tuple: (polarity, subjectivity)
    """
    blob = TextBlob(text)
    polarity, subjectivity = (
        float("{0:.2f}".format(blob.sentiment.polarity)),
        float("{0:.2f}".format(blob.sentiment.subjectivity))
    )
    return (polarity, subjectivity)


def __analyze_comments(comments: list) -> int:
    """Analysis of the comments during the speech. Currently, it just returns
    the number of comments.

    Args:
        comments (list): comments during the speech

    Returns:
        int: number of comments
    """
    return len(comments)
