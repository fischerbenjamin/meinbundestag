import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavIconProfile } from "../style/Icons";
import Basic from "../style/Views";
import ScreenName from '../components/ScreenName';



export default class ProfileScreen extends React.Component {
  
  static navigationOptions = {
    tabBarIcon: NavIconProfile
  };

  render() {
    console.log("RENDER ME");
    const {state} = this.props.navigation;
    console.log(state);
    return (
      <View style={Basic.container}>
        <ScreenName name={state.params.name} />
      </View>
    );
  }
}
