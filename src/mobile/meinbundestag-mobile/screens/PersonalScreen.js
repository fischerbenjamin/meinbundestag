import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavIconPersonal } from "../style/Icons";
import Basic from "../style/Views";
import ScreenName from '../components/ScreenName';


export default class PersonalScreen extends React.Component {
  
  static navigationOptions = {
    tabBarIcon: NavIconPersonal
  };
  
  render() {
    return (
      <View style={Basic.container}>
        <ScreenName name="Personal" />
      </View>
    );
  }
}
