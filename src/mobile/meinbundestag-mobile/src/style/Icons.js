import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import { colorMain, colorLight, colorWhite } from './Colors';


const ICON_SIZE_NAV = 24;
const ICON_SIZE_OVERVIEW = 48;

const NavIconHome = (props) => {
  const { focused } = props;
  return (
    <MaterialIcons
      name="home"
      size={ICON_SIZE_NAV}
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
      size={ICON_SIZE_NAV}
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
      size={ICON_SIZE_NAV}
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
      size={ICON_SIZE_NAV}
      color={focused ? colorMain : colorLight}
    />
  );
};
NavIconSpeech.propTypes = {
  focused: PropTypes.bool.isRequired,
};


const OverviewItemSidejobs = (
  <MaterialIcons
    name="attach-money"
    size={ICON_SIZE_OVERVIEW}
    color={colorWhite}
  />
);

const OverviewItemSpeeches = (
  <MaterialIcons
    name="message"
    size={ICON_SIZE_OVERVIEW}
    color={colorWhite}
  />
);

const OverviewItemVotes = (
  <MaterialIcons
    name="create"
    size={ICON_SIZE_OVERVIEW}
    color={colorWhite}
  />
);

const OverviewItemQuestions = (
  <MaterialIcons
    name="question-answer"
    size={ICON_SIZE_OVERVIEW}
    color={colorWhite}
  />
);


export {
  OverviewItemSidejobs,
  OverviewItemVotes,
  OverviewItemSpeeches,
  OverviewItemQuestions,
  NavIconHome,
  NavIconProfile,
  NavIconPersonal,
  NavIconSpeech,
};
