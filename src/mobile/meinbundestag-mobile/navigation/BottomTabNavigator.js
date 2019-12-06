import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PersonalScreen from '../screens/PersonalScreen';
import SpeechScreen from '../screens/SpeechScreen';


const BottomTabNavigator = createBottomTabNavigator(
  {
    home: HomeScreen,
    profile: ProfileScreen,
    personal: PersonalScreen,
    speech: SpeechScreen,
  },
  {
    tabBarOptions: {
      showLabel: false,
    },
  },
);

export default BottomTabNavigator;
