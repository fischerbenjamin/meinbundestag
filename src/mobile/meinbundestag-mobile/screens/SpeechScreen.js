import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavIconSpeech } from "../style/Icons";
import Basic from "../style/Views";
import ScreenName from '../components/ScreenName';



export default class SpeechScreen extends React.Component {
  
  static navigationOptions = {
    tabBarIcon: NavIconSpeech
  };

  render() {
    return (
      <View style={Basic.container}>
        <ScreenName name="Speech" />
      </View>
    );
  }
}
