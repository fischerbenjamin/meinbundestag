import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';


const style = StyleSheet.create({

  container: {
    marginTop: 10,
    marginBottom: 10,
  },

  text: {
    fontWeight: 500,
    margin: 5,
    textAlign: 'center',
  },

  textTopic: {
    fontSize: 16,
  },

  analysisContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  analysisText: {
    marginLeft: 20,
    marginRight: 20,
  },

});


class SpeechHeader extends React.PureComponent {
  render() {
    const {
      date, name, topic, party, subjectivity, polarity,
    } = this.props;
    const displayName = `${name} (${party})`;
    const displayPolarity = `Polarität ${polarity}`;
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

SpeechHeader.propTypes = {
  date: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  party: PropTypes.string.isRequired,
  polarity: PropTypes.number.isRequired,
  subjectivity: PropTypes.number.isRequired,
};

export default SpeechHeader;
