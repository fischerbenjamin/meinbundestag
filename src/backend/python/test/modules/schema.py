# pylint: disable=too-many-instance-attributes


"""Unittest for module processing."""


# Python imports
import unittest


# Local imports
import src.modules.schema as schema


class TestClass(unittest.TestCase):
    """Unittest class."""

    def setUp(self):
        """Set test objects up before each test case."""
        self.speech_paragraph = schema.SpeechParagraph(
            type_of_paragraph=schema.SpeechParagraph.TYPE_SPEECH,
            text="text"
        )
        self.speech_index = schema.SpeechIndex(
            index=42, name="some name"
        )
        self.speech_entry = schema.SpeechEntry(
            is_speaker=False,
            speaker="Albert Einstein",
            paragraphs=[self.speech_paragraph for _ in range(10)]
        )
        self.speech_content = schema.SpeechContent(
            entries=[self.speech_entry for _ in range(10)]
        )
        self.speech_analysis = schema.SpeechAnalysis(
            polarity=0.42, subjectivity=0.4711, number_of_comments=1337
        )
        self.speech = schema.Speech(
            meta={"foo": "bar", "John Doe": 42},
            content=self.speech_content,
            speaker_id="JohnDoe42",
            speech_id="FooBar4711"
        )
        self.protocol = schema.Protocol(
            url="www.johndoe/default/file.xml", fname="file.xml", done=True
        )
        self.env_vars = schema.EnvVars(
            database_config=("john", 42, False),
            api_config=("doe", 4711),
            scraper_config=(47, 11),
            protocol_config=("42", "foobar"),
            ods_config=("ods", "pipeline"),
            logging_config="info"
        )

    def test_speech_paragraph(self):
        """Test conversion of class SpeechParagraph."""
        original = self.speech_paragraph.to_json()
        duplicate = schema.SpeechParagraph.from_json(original).to_json()
        self.assertEqual(original, duplicate)

    def test_speech_index(self):
        """Test conversion of class SpeechIndex."""
        original = self.speech_index.to_json()
        duplicate = schema.SpeechIndex.from_json(original).to_json()
        self.assertEqual(original, duplicate)

    def test_speech_entry(self):
        """Test conversion of class SpeechEntry."""
        original = self.speech_entry.to_json()
        duplicate = schema.SpeechEntry.from_json(original).to_json()
        self.assertEqual(original, duplicate)

    def test_speech_content(self):
        """Test conversion of class SpeechContent."""
        original = self.speech_content.to_json()
        duplicate = schema.SpeechContent.from_json(original).to_json()
        self.assertEqual(original, duplicate)

    def test_speech_analysis(self):
        """Test conversion of class SpeechAnalysis."""
        original = self.speech_analysis.to_json()
        duplicate = schema.SpeechAnalysis.from_json(original).to_json()
        self.assertEqual(original, duplicate)

    def test_speech(self):
        """Test conversion of class Speech."""
        original = self.speech.to_json()
        duplicate = schema.Speech.from_json(original).to_json()
        self.assertEqual(original, duplicate)

    def test_protocol(self):
        """Test conversion of class Protocol."""
        original = self.protocol.to_json()
        duplicate = schema.Protocol.from_json(original).to_json()
        self.assertEqual(original, duplicate)

    def test_envvars(self):
        """Test conversion of class EnvVars."""
        original = self.env_vars.to_json()
        duplicate = schema.EnvVars.from_json(original).to_json()
        self.assertEqual(original, duplicate)


# pylint: enable=too-many-instance-attributes
