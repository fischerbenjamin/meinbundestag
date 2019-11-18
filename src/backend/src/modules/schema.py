"""
@author: Benjamin Fischer

This module defines the structure of all objects used in the backend that are
no python built-in types.
"""


import src.modules.myexceptions as myexceptions


class JSONSerializable:

    def to_json(self) -> dict:
        """Child classes must provide an implementation of this method in order
        to be stored in the database.

        Raises:
            NotImplementedError: override by child classes
        """
        raise NotImplementedError

    def from_json(self) -> "JSONSerializable":
        """Child classes must provide an implementation of this method in order
        to be initialized from the database.

        Raises:
            NotImplementedError: override by child classes
        """
        raise NotImplementedError

    @staticmethod
    def assert_keys(keys: list, obj: dict):
        if not all([True if k in obj.keys() else False for k in keys]):
            raise myexceptions.JSONInitializationException


class SpeechParagraph(JSONSerializable):

    """
    This class defines the structure of a single paragraph of a speech.
    """

    TYPE_SPEECH = "speech"
    TYPE_COMMENT = "comment"

    def __init__(self, type: str, text: str):
        self.type = type
        self.text = text

    def get_text(self) -> str:
        """Return the text of the paragraph. Replacing None values with empty
        string.

        Returns:
            str: text of the paragraph
        """
        return "" if self.text is None else self.text

    def is_speech(self) -> bool:
        """Returns True if the paragraph is part of the speech or a question,
        False otherwise

        Returns:
            bool: paragraph is no comment
        """
        return self.type == SpeechParagraph.TYPE_SPEECH

    def is_comment(self) -> bool:
        """Returns True if the paragrapg is a comment, False otherwise.

        Returns:
            bool: paragraph is comment
        """
        return self.type == SpeechParagraph.TYPE_COMMENT

    def to_json(self) -> dict:
        return dict(
            type=self.type,
            text=self.text
        )

    @classmethod
    def from_json(cls, obj: dict) -> "SpeechParagraph":
        SpeechParagraph.assert_keys(["type", "text"], obj)
        return cls(
            type=obj["type"],
            text=obj["text"]
        )


class Speech(JSONSerializable):

    """
    This class defines the structure of a 'Speech' object.
    """

    def __init__(
        self, name: str, party: str, topic: str, date: str,
        content: "SpeechContent", speaker_id: str, speech_id: str
    ):
        self.name = name
        self.party = party
        self.topic = topic
        self.date = date
        self.content = content
        self.speaker_id = speaker_id
        self.speech_id = speech_id
        self.analysis = SpeechAnalysis()

    def to_json(self):
        return dict(
            name=self.name,
            party=self.party,
            topic=self.topic,
            date=self.date,
            content=self.content.to_json(),
            speaker_id=self.speaker_id,
            speech_id=self.speech_id,
            analysis=self.analysis.to_json()
        )

    @classmethod
    def from_json(cls, obj: dict) -> "Speech":
        Speech.assert_keys([
            "name", "party", "topic", "date", "content", "speaker_id",
            "speech_id", "analysis"
        ], obj)
        return cls(
            name=obj["name"],
            party=obj["party"],
            topic=obj["topic"],
            date=obj["date"],
            content=SpeechContent.from_json(obj["content"]),
            speaker_id=obj["speaker_id"],
            speech_id=obj["speech_id"],
            analysis=SpeechAnalysis.from_json(obj["analysis"])
        )


class SpeechAnalysis(JSONSerializable):

    """
    This class defines the structure of the analysis of a speech.
    Analysis is done by the 'processing' module.
    """

    def __init__(
        self, polarity: float = 0.0, subjectivity: float = 0.0,
        number_of_comments: int = 0
    ):
        self.polarity = 0.0
        self.subjectivity = 0.0
        self.number_of_comments = 0

    def update(
        self, polarity: float, subjectivity: float, number_of_comments: int
    ) -> None:
        """Updates the values of the SpeechAnalysis object.

        Args:
            polarity (float): polarity of the speech
            subjectivity (float): subjectivity of the speech
            number_of_comments (int): number of comments during the speech
        """
        self.polarity = polarity
        self.subjectivity = subjectivity
        self.number_of_comments = number_of_comments

    def to_json(self) -> dict:
        return dict(
            polarity=self.polarity,
            subjectivity=self.subjectivity,
            number_of_comments=self.number_of_comments
        )

    @classmethod
    def from_json(cls, obj: dict) -> "SpeechAnalysis":
        SpeechAnalysis.assert_keys([
            "polarity", "subjectivity", "number_of_comments"
        ], obj)
        return cls(
            polarity=obj["polarity"],
            subjectivity=obj["subjectivity"],
            number_of_comments=obj["number_of_comments"]
        )


class Protocol(JSONSerializable):

    """
    This class defines the structure of a protocol. It stores the url and
    filename and a flag whether the protocol has already been processed or not.
    """

    def __init__(self, url: str, fname: str, done: bool = False):
        self.url = url
        self.fname = fname
        self.done = done

    def to_json(self) -> dict:
        return dict(
            url=self.url,
            fname=self.fname,
            done=self.done
        )

    @classmethod
    def from_json(cls, obj: dict) -> "Protocol":
        Protocol.assert_keys(["url", "fname", "done"], obj)
        return cls(
            url=obj["url"],
            fname=obj["fname"],
            done=obj["done"]
        )


class SpeechEntry(JSONSerializable):

    """
    This class defines the structure of a speech entry. An entry is a set of
    subsequent paragraphs of one deputy. The deputy can be either be the
    speaker himself, another deputy or the president of the parliament.
    """

    def __init__(self, speaker: str, is_speaker: bool, paragraphs: list):
        self.speaker = speaker
        self.is_speaker = is_speaker
        self.paragraphs = paragraphs

    def add_paragraph(self, paragraph: SpeechParagraph) -> None:
        """Adds an paragraph to the speech entry.

        Args:
            paragraph (SpeechParagraph): paragraph to add
        """
        self.paragraphs.append(paragraph)

    def to_json(self) -> dict:
        return dict(
            speaker=self.speaker,
            is_speaker=self.is_speaker,
            paragraphs=list(
                paragraph.to_json() for paragraph in self.paragraphs
            )
        )

    @classmethod
    def from_json(cls, obj) -> "SpeechEntry":
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

    """
    This class defines the structure of the contents of a single speech.
    The content is divided into objects of type SpeechEntry that contain
    subsequent paragraphs of a deputy.
    """

    def __init__(self, entries: list):
        self.entries = entries

    def add_speech_entry(self, speech_entry: SpeechEntry) -> None:
        """Adds a single speech entry to the content of the speech.

        Args:
            speech_entry (SpeechEntry): speech entry to add
        """
        self.entries.append(speech_entry)

    def get_speakers_text(self) -> str:
        """Returns the text of the speaker.

        Returns:
            str: text of the speech (without questions and comments)
        """
        return " ".join([
            speech_paragraph.get_text()
            for speech_entry in self.entries
            for speech_paragraph in speech_entry.paragraphs
            if speech_paragraph.is_speech() and speech_entry.is_speaker
        ])

    def get_comments(self) -> list:
        """Returns all comments of the speech

        Returns:
            list: comments
        """
        return [
            speech_paragraph.get_text()
            for speech_entry in self.entries
            for speech_paragraph in speech_entry.paragraphs
            if speech_paragraph.is_comment()
        ]

    def to_json(self) -> dict:
        return list(
            speech_entry.to_json() for speech_entry in self.entries
        )

    @classmethod
    def from_json(cls, obj) -> "SpeechContent":
        SpeechEntry.assert_keys(["entries"], obj)
        return cls(
            entries=list(
                SpeechEntry.from_json(speech_entry)
                for speech_entry in obj["entries"]
            )
        )


class SpeechIndex:

    """
    This class defines the structure of an index object that is used by the
    module @parsing. It helps dividing the speech into a list of subsequent
    paragraphs of a single deputy.
    """

    def __init__(self, index: int, name: str):
        self.index = index
        self.name = name
