"""
@author: Benjamin Fischer
"""


# Global imports
import json


class Speech:

    """
    This class is the representation of a speech.
    """

    def __init__(
        self, name, party, topic, date, text, comments, speaker_id, speech_id
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

    def __repr__(self):
        return json.dumps(
            self.__dict__, indent=4
        )
