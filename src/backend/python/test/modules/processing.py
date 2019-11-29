# pylint: disable=too-many-instance-attributes


"""Unittest for module processing."""


# Python imports
import unittest


# Local imports
import src.modules.schema as schema
import src.modules.processing as processing
import src.modules.myexceptions as myexceptions


class TestClass(unittest.TestCase):
    """Unittest class."""

    def setUp(self):
        """Set test objects up before each test case."""
        self.empty_speech = schema.Speech(
            meta=dict(name="", party="", topic="", date=""),
            content=schema.SpeechContent([]),
            speaker_id="",
            speech_id=""
        )
        self.negative_paragraph = schema.SpeechParagraph(
            type_of_paragraph=schema.SpeechParagraph.TYPE_SPEECH,
            text="""
                Das ist ein sehr negatives Beispiel. Viele schlechte
                Wörter kommen vor, wie Hass, Missgunst und Neid.
            """
        )
        self.negative_entry = schema.SpeechEntry(
            speaker="Albert Einstein",
            is_speaker=True,
            paragraphs=[self.negative_paragraph]
        )
        self.negative_content = schema.SpeechContent([self.negative_entry])
        self.negative_speech = schema.Speech(
            meta=dict(name="", party="", topic="", date=""),
            content=self.negative_content,
            speaker_id="",
            speech_id=""
        )
        self.positive_paragraph = schema.SpeechParagraph(
            type_of_paragraph=schema.SpeechParagraph.TYPE_SPEECH,
            text="""
                Das ist ein sehr positives Beispiel. Viele gute
                Wörter kommen vor, wie Freude, Glück und Hoffnung.
            """
        )
        self.positive_entry = schema.SpeechEntry(
            speaker="Albert Einstein",
            is_speaker=True,
            paragraphs=[self.positive_paragraph]
        )
        self.positive_content = schema.SpeechContent([self.positive_entry])
        self.positive_speech = schema.Speech(
            meta=dict(name="", party="", topic="", date=""),
            content=self.positive_content,
            speaker_id="",
            speech_id=""
        )
        # self.subjective_paragraph = schema.SpeechParagraph(
        #     type_of_paragraph=schema.SpeechParagraph.TYPE_SPEECH,
        #     text="""
        #         Ich bin der beste.
        #         Ich verlasse mich nur auf meine eigene Gefühle.
        #         Alles was zählt bin ich.
        #         Ich halt das für nicht richtig.
        #         Ich bin der Meinung, dass das korrekt ist.
        #         Meine persönliche Meinung ist toll.
        #     """
        # )
        # self.subjective_entry = schema.SpeechEntry(
        #     speaker="Albert Einstein",
        #     is_speaker=True,
        #     paragraphs=[self.subjective_paragraph]
        # )
        # self.subjective_content = schema.SpeechContent(
        #   [self.subjective_entry]
        # )
        # self.subjective_speech = schema.Speech(
        #     meta=dict(name="", party="", topic="", date=""),
        #     content=self.subjective_content,
        #     speaker_id="",
        #     speech_id=""
        # )
        # self.objective_paragraph = schema.SpeechParagraph(
        #     type_of_paragraph=schema.SpeechParagraph.TYPE_SPEECH,
        #     text="""
        #         Fakten belegen diese These. Ebenso konnten diverse
        #         unabhängige Studien diese Aussage bestätigen.
        #     """
        # )
        # self.objective_entry = schema.SpeechEntry(
        #     speaker="Albert Einstein",
        #     is_speaker=True,
        #     paragraphs=[self.objective_paragraph]
        # )
        # self.objective_content = schema.SpeechContent([self.objective_entry])
        # self.objective_speech = schema.Speech(
        #     meta=dict(name="", party="", topic="", date=""),
        #     content=self.objective_content,
        #     speaker_id="",
        #     speech_id=""
        # )

    def test_analyze_empty_speech(self):
        """Test function with an completely empty speech.

        Sentiment analysis should be equal to the default values.
        """
        processing.analyze_speeches([self.empty_speech])
        self.assertIsNotNone(self.empty_speech.analysis)
        self.assertEqual(self.empty_speech.analysis.number_of_comments, 0)
        self.assertEqual(self.empty_speech.analysis.polarity, 0.0)
        self.assertEqual(self.empty_speech.analysis.subjectivity, 0.5)

    def test_analyze_speeches_is_none(self):
        """Test function with None as argument.

        Function should raise an SpeechAnalysis Excpetion.
        """
        with self.assertRaises(myexceptions.SpeechAnalysisException):
            processing.analyze_speeches(None)

    @staticmethod
    def test_analyze_speeches_is_empty_list():
        """Test function with empty list as argument.

        Function should do nothing, especially do not raise an exception.
        """
        processing.analyze_speeches([])

    def test_analyze_sentiment_negative(self):
        """Test function with a negative speech.

        Sentiment analysis should return a negative value for polarity.
        """
        processing.analyze_speeches([self.negative_speech])
        self.assertLess(self.negative_speech.analysis.polarity, 0.0)

    def test_analyze_sentiment_positive(self):
        """Test function with a positive speech.

        Sentiment analysis should return a positive value for polarity.
        """
        processing.analyze_speeches([self.positive_speech])
        self.assertGreater(self.positive_speech.analysis.polarity, 0.0)

    # def test_analyze_subjective_speech(self):
    #    """Test function with a subjective speech.
    #
    #    Sentiment analysis should classify this speech as rather subjective.
    #    """
    #    processing.analyze_speeches([self.subjective_speech])
    #    self.assertGreater(self.subjective_speech.analysis.subjectivity, 0.5)
    #
    # def test_analyze_objective_speech(self):
    #    """Test function with a objective speech.
    #
    #    Sentiment analysis should classify this speech as rather objective.
    #    """
    #    processing.analyze_speeches([self.objective_speech])
    #    self.assertLess(self.objective_speech.analysis.subjectivity, 0.5)


# pylint: enable=too-many-instance-attributes
