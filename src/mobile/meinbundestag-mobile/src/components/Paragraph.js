import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const style = StyleSheet.create({

  commentContainer: {
    margin: 7,
    alignItems: 'center',
  },

  commentText: {
    fontStyle: 'italic',
    textAlign: 'center',
  },

  speechContainer: {
    margin: 5,
    alignItems: 'center',
  },

  speechText: {
    textAlign: 'justify',
  },

  speakerIsSpeakerText: {
    fontWeight: '500',
  },

  speakerIsNotSpeakerText: {
    fontWeight: '500',
    fontStyle: 'italic',
  },

  speakerNameContainer: {
    marginBottom: 5,
  },

});


class Paragraph extends React.PureComponent {
  static renderSpeechEntry(paragraphs, speaker, isSpeaker) {
    const paragraphText = paragraphs.map((para) => para.text).join(' ');
    const speakerIsSpeaker = (() => {
      if (isSpeaker) {
        return (
          <Text style={style.speakerIsSpeakerText}>{speaker}</Text>
        );
      }
      return (
        <Text style={style.speakerIsNotSpeakerText}>{speaker}</Text>
      );
    })();
    return (
      <View style={style.speechContainer}>
        <View style={style.speakerNameContainer}>
          {speakerIsSpeaker}
        </View>
        <View>
          <Text style={style.speechText}>{paragraphText}</Text>
        </View>
      </View>
    );
  }

  static renderCommentEntry(text) {
    return (
      <View style={style.commentContainer}>
        <Text style={style.commentText}>{text}</Text>
      </View>
    );
  }

  static composeContent(paragraphs, speaker, isSpeaker) {
    const result = [];
    let i;
    let indexFirstText = 0;
    for (i = 0; i < paragraphs.length; i += 1) {
      const type = paragraphs[i].type_of_paragraph;
      if (type === 'comment') {
        const componentParagraphs = paragraphs.slice(indexFirstText, i);
        const component = Paragraph.renderSpeechEntry(
          componentParagraphs, speaker, isSpeaker,
        );
        indexFirstText = i + 1;
        const comment = Paragraph.renderCommentEntry(paragraphs[i].text);
        result.push(component);
        result.push(comment);
      }
    }
    if (indexFirstText === paragraphs.length) return result;
    const componentParagraphs = paragraphs.slice(
      indexFirstText, paragraphs.length,
    );
    const component = Paragraph.renderSpeechEntry(
      componentParagraphs, speaker, isSpeaker,
    );
    result.push(component);
    return result;
  }

  render() {
    const { paragraphs, speaker, isSpeaker } = this.props;
    const content = Paragraph.composeContent(paragraphs, speaker, isSpeaker);
    return (
      <View>
        {content}
      </View>
    );
  }
}

Paragraph.propTypes = {
  paragraphs: PropTypes.arrayOf(PropTypes.any).isRequired,
  speaker: PropTypes.string.isRequired,
  isSpeaker: PropTypes.bool.isRequired,
};

export default Paragraph;
