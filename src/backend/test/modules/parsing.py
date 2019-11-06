import unittest


import src.modules.parsing as parsing
import src.modules.myexceptions as myexceptions


class TestClass(unittest.TestCase):

    def test_get_speeches_filepath_none(self):
        with self.assertRaises(myexceptions.SpeechParsingException):
            list(parsing.get_speeches(None))

    def test_get_speeches_filepath_empty(self):
        with self.assertRaises(myexceptions.SpeechParsingException):
            list(parsing.get_speeches(""))

    def test_get_speeches_filepath_not_exists(self):
        with self.assertRaises(myexceptions.SpeechParsingException):
            list(parsing.get_speeches("XYZ"))

    def test_get_speeches_filepath_no_file(self):
        with self.assertRaises(myexceptions.SpeechParsingException):
            list(parsing.get_speeches("."))

    def test_get_speeches_filepath_no_xml(self):
        with self.assertRaises(myexceptions.SpeechParsingException):
            list(parsing.get_speeches("./parsing.py"))
