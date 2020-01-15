"""Typedef of custom objects.

This module defines the structure of all objects used in the backend that are
no python built-in types.
"""


# Python imports
import re
from typing import Dict, Any, Union, List, Tuple


# Local imports
import src.modules.myexceptions as myexceptions


class JSONSerializable:
    """Base class for all classes which are stored in the database."""

    def to_json(self) -> dict:
        """Convert to json data.

        Child classes must provide an implementation of this method in order
        to be stored in the database.

        Raises:
            NotImplementedError: override by child classes

        """
        raise NotImplementedError

    def from_json(self, obj: dict) -> "JSONSerializable":
        """Initialize from json data.

        Child classes must provide an implementation of this method in order
        to be initialized from the database.

        Args:
            obj (dict): json data to load from

        Raises:
            NotImplementedError: override by child classes

        """
        raise NotImplementedError

    @staticmethod
    def assert_keys(keys: list, obj: dict):
        """Assert that the object has all required keys.

        Args:
            keys (list): required keys
            obj (dict): object to convert

        Raises:
            myexceptions.JSONInitializationException: if key is not in object

        """
        for k in keys:
            if k not in obj.keys():
                raise myexceptions.JSONInitializationException


class SpeechParagraph(JSONSerializable):
    """Structure of a single paragraph of a speech."""

    TYPE_SPEECH = "speech"
    TYPE_COMMENT = "comment"

    def __init__(self, type_of_paragraph: str, text: str):
        """Initialize object.

        Args:
            type (str): type of the paragraph
            text (str): text of the paragraph

        """
        self.type_of_paragraph = type_of_paragraph
        self.text = text

    def get_text(self) -> str:
        """Return the text of the paragraph.

        None values are replaced with the empty string.

        Returns:
            str: text of the paragraph

        """
        return "" if self.text is None else self.text

    def is_speech(self) -> bool:
        """Check if the paragraph is actual speech text.

        Returns:
            bool: True if the paragraph is part of the speech, False otherwise

        """
        return self.type_of_paragraph == SpeechParagraph.TYPE_SPEECH

    def is_comment(self) -> bool:
        """Check if the paragraph is a comment.

        Returns:
            bool: True if the paragraph is a comment, False otherwise

        """
        return self.type_of_paragraph == SpeechParagraph.TYPE_COMMENT

    def to_json(self) -> Dict[str, str]:
        """Convert object to json data.

        Returns:
            Dict[str, str]: mapping of attributes

        """
        return dict(
            type_of_paragraph=self.type_of_paragraph,
            text=self.text
        )

    @classmethod
    def from_json(cls, obj: Dict[str, Any]) -> "SpeechParagraph":
        """Initialize an object from json data.

        Returns:
            SpeechParagrah: object

        """
        SpeechParagraph.assert_keys(["type_of_paragraph", "text"], obj)
        return cls(
            type_of_paragraph=obj["type_of_paragraph"],
            text=obj["text"]
        )


class Speech(JSONSerializable):
    """Structure of a single speech."""

    LENGTH_THRESHOLD = 1000

    def __init__(
            self, meta: Dict[str, str],
            content: "SpeechContent", speaker_id: str, speech_id: str
    ):
        """Init object.

        Args:
            meta (Dict[str, str]): (name, party, topic, date)
            content (SpeechContent): content of the speech
            speaker_id (str): speaker's ID
            speech_id (str): ID of the speech

        """
        self.meta = meta
        self.content = content
        self.speaker_id = speaker_id
        self.speech_id = speech_id
        self.analysis = SpeechAnalysis()

    def to_json(self) -> Dict[str, Any]:
        """Convert object to json data.

        Returns:
            Dict[str, Any]: mapping of attributes

        """
        return dict(
            meta=self.meta,
            content=self.content.to_json(),
            speaker_id=self.speaker_id,
            speech_id=self.speech_id,
            analysis=self.analysis.to_json()
        )

    @classmethod
    def from_json(cls, obj: dict) -> "Speech":
        """Initialize an object from json data.

        Returns:
            Speech: object

        """
        Speech.assert_keys([
            "meta", "content", "speaker_id", "speech_id"
        ], obj)
        return cls(
            meta=obj["meta"],
            content=SpeechContent.from_json(obj["content"]),
            speaker_id=obj["speaker_id"],
            speech_id=obj["speech_id"]
        )

    def assert_is_relevant(self) -> bool:
        """Assert that the speech is relevant enough.

        This method is used for filtering 'speeches' that are too short. It
        often appears that questions/etc. that are considerably shorter than
        a actual speech are tagged as speeches in the protocol files.

        Returns:
            bool: true if considered a relevant speech, false otherwise

        """
        text = self.content.get_speakers_text()
        return len(text) >= Speech.LENGTH_THRESHOLD


class SpeechAnalysis(JSONSerializable):
    """Structure of the analysis of a speech."""

    def __init__(
            self, polarity: float = 0.0, subjectivity: float = 0.5,
            number_of_comments: int = 0
    ):
        """Init object.

        Args:
            polarity (float, optional): polarity. Defaults to 0.0.
            subjectivity (float, optional): subjectivity. Defaults to 0.0.
            number_of_comments (int, optional): #comments. Defaults to 0.

        """
        self.polarity = polarity
        self.subjectivity = subjectivity
        self.number_of_comments = number_of_comments

    def update(
            self, polarity: float, subjectivity: float, number_of_comments: int
    ) -> None:
        """Update the values of the current object.

        Args:
            polarity (float): polarity of the speech
            subjectivity (float): subjectivity of the speech
            number_of_comments (int): number of comments during the speech

        """
        self.polarity = polarity
        self.subjectivity = subjectivity
        self.number_of_comments = number_of_comments

    def to_json(self) -> Dict[str, float]:
        """Convert object to json data.

        Returns:
            Dict[str, float]: mapping of attributes

        """
        return dict(
            polarity=self.polarity,
            subjectivity=self.subjectivity,
            number_of_comments=self.number_of_comments
        )

    @classmethod
    def from_json(cls, obj: dict) -> "SpeechAnalysis":
        """Initialize object from json data.

        Returns:
            SpeechAnalysis: object

        """
        SpeechAnalysis.assert_keys([
            "polarity", "subjectivity", "number_of_comments"
        ], obj)
        return cls(
            polarity=obj["polarity"],
            subjectivity=obj["subjectivity"],
            number_of_comments=obj["number_of_comments"]
        )


class Protocol(JSONSerializable):
    """Structure of a protocol."""

    def __init__(self, url: str, fname: str, done: bool = False):
        """Init object.

        Args:
            url (str): url of the protocol file
            fname (str): filename of the protocol
            done (bool, optional): processed or not. Defaults to False.

        """
        self.url = url
        self.fname = fname
        self.done = done

    def to_json(self) -> Dict[str, Union[str, bool]]:
        """Convert object to json data.

        Returns:
            Dict[str, Union[str, bool]]: mapping of attributes

        """
        return dict(
            url=self.url,
            fname=self.fname,
            done=self.done
        )

    @classmethod
    def from_json(cls, obj: dict) -> "Protocol":
        """Initialize object from json data.

        Returns:
            Protocol: object

        """
        Protocol.assert_keys(["url", "fname", "done"], obj)
        return cls(
            url=obj["url"],
            fname=obj["fname"],
            done=obj["done"]
        )


class SpeechEntry(JSONSerializable):
    """Structure of a speech entry.

    An entry is a set of subsequent paragraphs of one deputy.
    The deputy can be either be the speaker himself, another deputy or the
    president of the parliament.
    """

    def __init__(
            self, speaker: str, is_speaker: bool,
            paragraphs: List["SpeechParagraph"]
    ):
        """Init object.

        Args:
            speaker (str): deputy's name
            is_speaker (bool): deputy is speaker or not
            paragraphs (List[SpeechParagraph]): list of subsequent paragraphs

        """
        self.speaker = speaker
        self.is_speaker = is_speaker
        self.paragraphs = paragraphs

    def add_paragraph(self, paragraph: SpeechParagraph) -> None:
        """Add an paragraph to the speech entry.

        Append the paragraph to the list of paragraphs.

        Args:
            paragraph (SpeechParagraph): paragraph to add

        """
        self.paragraphs.append(paragraph)

    def to_json(self) -> Dict[str, Union[str, bool, List[SpeechParagraph]]]:
        """Convert object to json data.

        Returns:
            Dict[str, Union[str, bool, List[SpeechParagraph]]]: attributes

        """
        return dict(
            speaker=self.speaker,
            is_speaker=self.is_speaker,
            paragraphs=list(p.to_json() for p in self.paragraphs)
        )

    @classmethod
    def from_json(cls, obj) -> "SpeechEntry":
        """Initialize object from json data.

        Returns:
            SpeechEntry: object

        """
        SpeechEntry.assert_keys(["speaker", "is_speaker", "paragraphs"], obj)
        return cls(
            speaker=obj["speaker"],
            is_speaker=obj["is_speaker"],
            paragraphs=list(
                SpeechParagraph.from_json(paragraph)
                for paragraph in obj["paragraphs"]
            )
        )


class SpeechContent:
    """Structure of the content of a single speech.

    The content is divided into objects of type SpeechEntry that contain
    subsequent paragraphs of a deputy.
    """

    def __init__(self, entries: List[SpeechEntry]):
        """Init object.

        Args:
            entries (List[SpeechEntry]): entries of the speech (so far)

        """
        self.entries = entries

    def add_speech_entry(self, speech_entry: SpeechEntry) -> None:
        """Add a single speech entry to the content of the speech.

        Args:
            speech_entry (SpeechEntry): speech entry to add

        """
        self.entries.append(speech_entry)

    def get_speakers_text(self) -> str:
        """Return the text of the speaker.

        Iterate over all paragraphs and check if the text of the paragraph
        was spoken by the speaker.

        Returns:
            str: text of the speech (without questions and comments)

        """
        return " ".join([
            speech_paragraph.get_text()
            for speech_entry in self.entries
            for speech_paragraph in speech_entry.paragraphs
            if speech_paragraph.is_speech() and speech_entry.is_speaker
        ])

    def get_comments(self) -> List[str]:
        """Return all comments during the speech.

        Returns:
            List[str]: the text of all comments during the speech

        """
        return [
            speech_paragraph.get_text()
            for speech_entry in self.entries
            for speech_paragraph in speech_entry.paragraphs
            if speech_paragraph.is_comment()
        ]

    def to_json(self) -> Dict[str, List["SpeechEntry"]]:
        """Convert object to json data.

        Returns:
            Dict[str, List["SpeechEntry"]]: mappin of attributes

        """
        return dict(
            entries=[speech_entry.to_json() for speech_entry in self.entries]
        )

    @classmethod
    def from_json(cls, obj) -> "SpeechContent":
        """Initialize object from json data.

        Returns:
            SpeechContent: object

        """
        SpeechEntry.assert_keys(["entries"], obj)
        return cls(
            entries=list(
                SpeechEntry.from_json(speech_entry)
                for speech_entry in obj["entries"]
            )
        )

    def assert_valid(self) -> bool:
        """Assert that the content contains text.

        Returns:
            bool: True if content is valid, False otherwise

        """
        if len(self.entries) == 0:
            return False
        for entry in self.entries:
            if len(entry.paragraphs) == 0:
                return False
            for para in entry.paragraphs:
                if not para.text:
                    return False
        return True


class SpeechIndex(JSONSerializable):
    """Structure of an speech index object.

    Used for parsing a speech. It helps dividing the speech into a list of
    subsequent paragraphs of a single deputy.
    """

    def __init__(self, index: int, name: str):
        """Init object.

        Args:
            index (int): index of element
            name (str): deput's name

        """
        self.index = index
        self.name = name

    def to_json(self) -> Dict[str, Union[int, str]]:
        """Convert object to json data.

        Returns:
            Dict[str, Union[int, str]]: mapping of attributes

        """
        return dict(index=self.index, name=self.name)

    @classmethod
    def from_json(cls, obj: dict) -> "SpeechIndex":
        """Initialize object from json data.

        Returns:
            SpeechIndex: object

        """
        SpeechEntry.assert_keys(["index", "name"], obj)
        return cls(index=int(obj["index"]), name=obj["name"])


class EnvVars(JSONSerializable):
    """Structure of environment variables used by the backend."""

    # pylint: disable=too-many-arguments
    def __init__(
            self,
            database_config: Tuple[str, int, bool],
            api_config: Tuple[str, int, bool],
            scraper_config: Tuple[int, int],
            protocol_config: Tuple[str, str],
            ods_config: Tuple[str, str, str, str],
            logging_config: str
    ):
        """Init object.

        Args:
            database_config (Tuple[str, int, bool]): (host, port, clear)
            api_config (Tuple[str, int, str, str, str]):
                (host, port, author, version, contact)
            scraper_config (Tuple[int, int]): (timeout, interval)
            protocol_config (Tuple[str, str]): (dtd file, destination)
            ods_config (Tuple[str, str]):
                (ods host, deputies pipeline, fallback deputies, profile url)
            logging_config (str): logging level

        """
        self.database_config = database_config
        self.api_config = api_config
        self.scraper_config = scraper_config
        self.protocol_config = protocol_config
        self.ods_config = ods_config
        self.logging_config = logging_config
    # pylint: enable=too-many-arguments

    def to_json(self) -> Dict[str, Any]:
        """Convert object to json data.

        Returns:
            Dict[str, Any]: mapping of attributes

        """
        return dict(
            database_config=self.database_config,
            api_config=self.api_config,
            scraper_config=self.scraper_config,
            protocol_config=self.protocol_config,
            ods_config=self.ods_config,
            logging_config=self.logging_config
        )

    @classmethod
    def from_json(cls, obj: Dict[str, Any]) -> "EnvVars":
        """Initialize object from json data.

        Returns:
            EnvVars: object

        """
        EnvVars.assert_keys([
            "database_config", "api_config", "scraper_config",
            "protocol_config", "ods_config", "logging_config"
        ], obj)
        return cls(
            database_config=obj["database_config"],
            api_config=obj["api_config"],
            scraper_config=obj["scraper_config"],
            protocol_config=obj["protocol_config"],
            ods_config=obj["ods_config"],
            logging_config=obj["logging_config"]
        )


class Name(JSONSerializable):
    """Structure of a deputy's name."""

    def __init__(self, components: List[str]):
        """Initialize object.

        Args:
            components (List[str]): name components

        """
        self.components = components

    def __str__(self) -> str:
        """Override string representation.

        Returns:
            str: string representation

        """
        return " ".join([comp.capitalize() for comp in self.components])

    @classmethod
    def from_json(cls, obj: Dict[str, str]) -> "Name":
        """Initialize object from json data.

        Returns:
            Name: object

        """
        Name.assert_keys(["components"], obj)
        return cls(components=obj["components"])

    @classmethod
    def from_url_string(cls, name: str) -> "Name":
        """Initialize object from url name.

        Returns:
            Name: object

        """
        parts = name.split("-")
        return cls(components=[part.capitalize() for part in parts])

    @staticmethod
    def from_profile(profile: Dict[str, Any]) -> str:
        """Return the full name of an single profile of abgeordnetenwatch.

        Args:
            profile (Dict[str, Any]): profile of api call

        Returns:
            str: full name

        """
        first_name, last_name = (
            profile["personal"]["first_name"], profile["personal"]["last_name"]
        )
        full_name = "{} {}".format(first_name, last_name)
        return full_name

    def to_json(self) -> Dict[str, str]:
        """Convert object to json data.

        Returns:
            Dict[str, str]: mapping of attributes

        """
        return dict(components=self.components)

    def get_regex(self) -> re.Pattern:
        """Return the regular expression of the name.

        The regex is used for searches in the database.

        Returns:
            re.Pattern: pattern of regular expression

        """
        return re.compile("(.)*".join(self.components), re.IGNORECASE)

    def to_url_string(self) -> str:
        """Convert the name to url styled string.

        Returns:
            str: name in url format

        """
        return " ".join(self.components).lower()
