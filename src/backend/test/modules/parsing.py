import unittest


import src.modules.parsing as parsing
import src.modules.config as config


class TestClass(unittest.TestCase):

    def test_get_speeches_filepath_none(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches(None))

    def test_get_speeches_filepath_empty(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches(""))

    def test_get_speeches_filepath_not_exists(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("XYZ"))

    def test_get_speeches_filepath_no_file(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("."))

    def test_get_speeches_filepath_no_xml(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("./parsing.py"))

    def test_get_speeches_filepath_valid(self):
        speeches = list(parsing.get_speeches(config.SAMPLE_PROTOCOL))
        self.assertGreater(len(speeches), 0)
