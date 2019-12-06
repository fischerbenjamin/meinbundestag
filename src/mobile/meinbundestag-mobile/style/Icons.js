import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';


const NavIconHome = (props) => (
  <MaterialIcons
    name="home"
    size={20}
    color={props.focused ? 'grey' : 'darkgrey'}
  />
);

const NavIconProfile = (props) => (
  <MaterialIcons
    name="person"
    size={20}
    color={props.focused ? 'grey' : 'darkgrey'}
  />
);

const NavIconPersonal = (props) => (
  <MaterialIcons
    name="info-outline"
    size={20}
    color={props.focused ? 'grey' : 'darkgrey'}
  />
);

const NavIconSpeech = (props) => (
  <MaterialIcons
    name="message"
    size={20}
    color={props.focused ? 'grey' : 'darkgrey'}
  />
);

export {
  NavIconHome,
  NavIconProfile,
  NavIconPersonal,
  NavIconSpeech,
};
