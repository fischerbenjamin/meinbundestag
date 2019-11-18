"""
@author: Benjamin Fischer
"""


import unittest


import src.modules.processing as processing
import src.modules.schema as schema


class TestClass(unittest.TestCase):

    def setUp(self):
        self.empty_speech = schema.Speech(
            name="", party="", topic="", date="",
            content=schema.SpeechContent([]), speaker_id="", speech_id=""
        )

    def test_analyze_empty_speech(self):
        processing.analyze_speeches([self.empty_speech])
        self.assertIsNotNone(self.empty_speech.analysis)
        self.assertEqual(self.empty_speech.analysis.number_of_comments, 0)
        self.assertEqual(self.empty_speech.analysis.polarity, 0.0)
        self.assertEqual(self.empty_speech.analysis.subjectivity, 0.0)
