"""
@author: Benjamin Fischer
"""


# Global imports
import json
import string
import random


class Speech:

    """
    This class is the representation of a speech.
    """

    def __init__(
        self, name: str, party: str, topic: str, date: str, text: str,
        comments: list, speaker_id: str, speech_id: str
    ):
        self.name = name
        self.party = party
        self.topic = topic
        self.date = date
        self.text = text
        self.comments = comments
        self.speaker_id = speaker_id
        self.speech_id = speech_id
        self.analysis = {}

    @classmethod
    def dummy_speech(cls) -> "Speech":
        return cls(
            name="", party="", topic="", date="", text="", comments=[],
            speaker_id="", speech_id=""
        )

    @classmethod
    def random_speech(cls) -> "Speech":
        return cls(
            name=Speech.__random_string(random.randint(1, 10)),
            party=Speech.__random_string(random.randint(1, 10)),
            topic=Speech.__random_string(random.randint(1, 10)),
            date=Speech.__random_string(random.randint(1, 10)),
            text=Speech.__random_string(random.randint(1, 10)),
            comments=[
                Speech.__random_string(random.randint(1, 10))
                for i in range(random.randint(1, 10))
            ],
            speaker_id=Speech.__random_string(random.randint(1, 10)),
            speech_id=Speech.__random_string(random.randint(1, 10)),
        )

    @staticmethod
    def __random_string(num: int):
        letters = string.ascii_lowercase
        return ''.join(random.choice(letters) for i in range(num))

    def __str__(self):
        return json.dumps(
            self.__dict__, indent=4
        )
