import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './ParagraphStyle';

/**
 * @author Benjamin Fischer
 * @description Implementation of the Paragraph component
 */

/**
 * @classdesc
 * This class represents a single paragraph of a speech. A paragraph can either
 * be the speaker's text, a comment or some other's speaker text.
 * @extends React.PureComponent
 */
class Paragraph extends React.PureComponent {
  /**
   * @summary Render a comment that occured during the sspeech
   * @param {string} text - text of the commmet
   * @returns {Object} JSX rendered content
   */
  static renderCommentEntry(text) {
    return (
      <View style={style.commentContainer}>
        <Text style={style.commentText}>{text}</Text>
      </View>
    );
  }

  /**
   * @summary Render a speech entry
   * @description
   * The text can either be spoken by the speaker itself or some other deputy
   * @param {array} paragraphs - paragraphs of this entry
   * @param {string} speaker - name of the speaker
   * @param {bool} isSpeaker - true if it is the speaker itself, false otherwise
   * @returns {Object} JSX rendered content
   */
  static renderSpeechEntry(paragraphs, speaker, isSpeaker) {
    const paragraphText = paragraphs.map((para) => para.text).join(' ');
    const speakerIsSpeaker = (() => {
      if (isSpeaker) {
        return (
          <Text style={style.speakerIsSpeakerText}>
            {speaker}
          </Text>
        );
      }
      return (
        <Text style={style.speakerIsNotSpeakerText}>
          {speaker}
        </Text>
      );
    })();
    return (
      <View style={style.speechContainer}>
        <View style={style.speakerNameContainer}>
          {speakerIsSpeaker}
        </View>
        <View>
          <Text style={style.speechText}>
            {paragraphText}
          </Text>
        </View>
      </View>
    );
  }

  /**
   * @summary Compose the content of the speech
   * @description
   * This method does the actual work ;)
   * @param {array} paragraphs - paragraphs of this entry
   * @param {string} speaker - name of the speaker
   * @param {bool} isSpeaker - true if it is the speaker itself, false otherwise
   * @returns {Object} JSX rendered content
   */
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

  /**
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
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

/**
 * @description Properties of the component
 * @property {array} paragraphs - list of paragraphs
 * @property {string} speaker - name of the speaker
 * @property {bool} isSpeaker - true if the paragraph is spoken by the speaker itself
 */
Paragraph.propTypes = {
  paragraphs: PropTypes.arrayOf(PropTypes.any).isRequired,
  speaker: PropTypes.string.isRequired,
  isSpeaker: PropTypes.bool.isRequired,
};

export default Paragraph;
