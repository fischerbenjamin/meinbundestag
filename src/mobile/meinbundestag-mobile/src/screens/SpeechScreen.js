import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import styles from '../style/Views';
import { NavIconSpeech } from '../style/Icons';
import ScreenName from '../components/ScreenName';


export default class SpeechScreen extends React.Component {
  static navigationOptions = {
    tabBarIcon: NavIconSpeech,
  };

  render() {
    // const { profile } = this.props;
    return (
      <View style={styles.container.basic}>
        <ScreenName name="Speech" />
      </View>
    );
  }
}


SpeechScreen.propTypes = {
  profile: PropTypes.shape.isRequired,
};
