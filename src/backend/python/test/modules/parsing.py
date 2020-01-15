"""Unittest for module parsing."""


# Python imports
import unittest


# Local imports
import src.modules.parsing as parsing


class TestClass(unittest.TestCase):
    """Unittest class."""

    DTD_FILE = "data/protocol.dtd"
    PROTOCOL = "data/protocol.xml"
    PROTOCOL_NUMBER_OF_SPEECHES = 91

    def test_get_speeches_filepath_none(self):
        """Test function with None as protocol file.

        Additionaly, a valid dtd file is provided.
        """
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches(None, TestClass.DTD_FILE))

    def test_get_speeches_filepath_empty(self):
        """Test function with empty string as protocol file.

        Additionaly, a valid dtd file is provided.
        """
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("", TestClass.DTD_FILE))

    def test_get_speeches_filepath_not_exists(self):
        """Test function with not existing path as protocol file.

        Additionaly, a valid dtd file is provided.
        """
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("XYZ", TestClass.DTD_FILE))

    def test_get_speeches_filepath_no_file(self):
        """Test function with directory as protocol file.

        Additionaly, a valid dtd file is provided.
        """
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches(".", TestClass.DTD_FILE))

    def test_get_speeches_filepath_no_xml(self):
        """Test function with python file as protocol file.

        Additionaly, a valid dtd file is provided.
        """
        with self.assertRaises(FileNotFoundError):
            list(parsing.get_speeches("./parsing.py", TestClass.DTD_FILE))

    def test_get_speeches_filepath_valid(self):
        """Test function with example protocol file as protocol file.

        Additionaly, a valid dtd file is provided. Assert that the number
        of parsed speaches is equal to the number of speeches in the protocol.
        """
        speeches = list(
            parsing.get_speeches(TestClass.PROTOCOL, TestClass.DTD_FILE)
        )
        self.assertEqual(len(speeches), TestClass.PROTOCOL_NUMBER_OF_SPEECHES)
