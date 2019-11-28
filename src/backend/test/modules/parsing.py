import unittest

import src.modules.parsing as parsing


class TestClass(unittest.TestCase):

    DTD_FILE = "data/protocol.dtd"
    PROTOCOL = "data/protocol.xml"

    def test_get_speeches_filepath_none(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches(None, TestClass.DTD_FILE))

    def test_get_speeches_filepath_empty(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("", TestClass.DTD_FILE))

    def test_get_speeches_filepath_not_exists(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("XYZ", TestClass.DTD_FILE))

    def test_get_speeches_filepath_no_file(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches(".", TestClass.DTD_FILE))

    def test_get_speeches_filepath_no_xml(self):
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("./parsing.py", TestClass.DTD_FILE))

    def test_get_speeches_filepath_valid(self):
        speeches = list(
            parsing.get_speeches(TestClass.PROTOCOL, TestClass.DTD_FILE)
        )
        self.assertGreater(len(speeches), 0)
