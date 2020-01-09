import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './SpeechHeaderStyle';

/**
 * @author Benjamin Fischer
 * @description Implementation of the SpeechHeaderComponent
 */

/**
 * @classdesc
 * This class represents the header of a speech. The header is used to display
 * the title and other general information about the speech.
 * @extends React.PureComponent
 */
class SpeechHeader extends React.PureComponent {
  /**
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const {
      date, name, topic, party, subjectivity, polarity,
    } = this.props;
    const displayName = `${name} (${party})`;
    const displayPolarity = `Stimmung ${polarity}`;
    const displaySubjectivity = `Objektivität ${subjectivity}`;
    return (
      <View style={style.container}>
        <View>
          <Text style={[style.text, style.textTopic]}>
            {topic.charAt(0).toUpperCase() + topic.slice(1)}
          </Text>
        </View>
        <View>
          <Text style={style.text}>
            {date}
          </Text>
          <Text style={style.text}>
            {displayName}
          </Text>
        </View>
        <View style={style.analysisContainer}>
          <Text style={[style.text, style.analysisText]}>
            {displayPolarity}
          </Text>
          <Text style={[style.text, style.analysisText]}>
            {displaySubjectivity}
          </Text>
        </View>
      </View>
    );
  }
}

/**
 * @description Properties of the component
 * @property {string} date - date of the speech
 * @property {string} name - name of the speaker
 * @property {string} topic - title of the speechz
 * @property {string} party - party of the speaker
 * @property {number} polarity - measurement of the mood of the speech
 * @property {number} subjectivity - measurement of the subjectivity of the speech
 */
SpeechHeader.propTypes = {
  date: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  party: PropTypes.string.isRequired,
  polarity: PropTypes.number.isRequired,
  subjectivity: PropTypes.number.isRequired,
};

export default SpeechHeader;
