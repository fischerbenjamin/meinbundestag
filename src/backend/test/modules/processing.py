"""
@author: Benjamin Fischer
"""


import unittest


import src.modules.processing as processing_src
import src.modules.schema as schema_src


class TestClass(unittest.TestCase):

    def setUp(self):
        self.dummy_speech = schema_src.Speech.dummy_speech()
        self.random_speech = schema_src.Speech.random_speech()

    def test_analyze_dummy_speech(self):
        processing_src.analyze(self.dummy_speech)
        self.assertIsNotNone(self.dummy_speech.analysis)
        self.assertListEqual(self.dummy_speech.comments, [])
        self.assertEqual(self.dummy_speech.analysis["no_comments"], 0)
        self.assertEqual(self.dummy_speech.analysis["polarity"], 0.0)
        self.assertEqual(self.dummy_speech.analysis["subjectivity"], 0.0)

    def test_analyze_random_speech(self):
        processing_src.analyze(self.random_speech)
        self.assertIsNotNone(self.random_speech.analysis)
        self.assertNotEqual(self.random_speech.comments, [])
        self.assertNotEqual(self.random_speech.analysis["no_comments"], 0)
