import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import { colorMain, colorLight } from './Colors';


const ICON_SIZE = 24;


const NavIconHome = (props) => {
  const { focused } = props;
  return (
    <MaterialIcons
      name="home"
      size={ICON_SIZE}
      color={focused ? colorMain : colorLight}
    />
  );
};
NavIconHome.propTypes = {
  focused: PropTypes.bool.isRequired,
};


const NavIconProfile = (props) => {
  const { focused } = props;
  return (
    <MaterialIcons
      name="person"
      size={ICON_SIZE}
      color={focused ? colorMain : colorLight}
    />
  );
};
NavIconProfile.propTypes = {
  focused: PropTypes.bool.isRequired,
};


const NavIconPersonal = (props) => {
  const { focused } = props;
  return (
    <MaterialIcons
      name="info-outline"
      size={ICON_SIZE}
      color={focused ? colorMain : colorLight}
    />
  );
};
NavIconPersonal.propTypes = {
  focused: PropTypes.bool.isRequired,
};


const NavIconSpeech = (props) => {
  const { focused } = props;
  return (
    <MaterialIcons
      name="message"
      size={ICON_SIZE}
      color={focused ? colorMain : colorLight}
    />
  );
};
NavIconSpeech.propTypes = {
  focused: PropTypes.bool.isRequired,
};


export {
  NavIconHome,
  NavIconProfile,
  NavIconPersonal,
  NavIconSpeech,
};
