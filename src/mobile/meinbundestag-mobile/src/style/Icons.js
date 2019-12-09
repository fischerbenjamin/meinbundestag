import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../style/Views';


const NavIconHome = (props) => (
  <MaterialIcons
    name="home"
    size={20}
    color={props.focused ? styles.colors.focus : styles.colors.unfocus }
  />
);

const NavIconProfile = (props) => (
  <MaterialIcons
    name="person"
    size={20}
    color={props.focused ? styles.colors.focus : styles.colors.unfocus }
  />
);

const NavIconPersonal = (props) => (
  <MaterialIcons
    name="info-outline"
    size={20}
    color={props.focused ? styles.colors.focus : styles.colors.unfocus }
  />
);

const NavIconSpeech = (props) => (
  <MaterialIcons
    name="message"
    size={20}
    color={props.focused ? styles.colors.focus : styles.colors.unfocus }
  />
);

export {
  NavIconHome,
  NavIconProfile,
  NavIconPersonal,
  NavIconSpeech,
};
