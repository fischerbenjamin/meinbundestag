"""This module defines all custom exceptions.

The custom exceptions are used to clarify the reason for an unexpected
behaviour.
"""


class DatabaseInitException(Exception):
    """Initializing the database connection fails."""


class SpeechParsingException(Exception):
    """Parsing a speech fails."""


class SpeechAnalysisException(Exception):
    """Analyzing a speech fails."""


class JSONInitializationException(Exception):
    """Initializing a custom python object from json data fails."""
