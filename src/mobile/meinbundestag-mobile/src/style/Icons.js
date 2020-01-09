import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

import PropTypes from 'prop-types';
import {
  colorMain,
  colorLight,
  colorWhite,
  indicator0,
  indicator1,
  indicator2,
  indicator3,
  indicator4,
} from './Colors';


const ICON_SIZE_NAV = 24;
const ICON_SIZE_OVERVIEW = 48;
const ICON_SIZE_HUGE = 72;

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

const NoConnection = (
  <MaterialIcons
    name="cloud-off"
    size={ICON_SIZE_HUGE}
    color={colorWhite}
  />
);

/**
 * @summary Create mood icons for the SpeechHeader component
 * @param {number} mood - indicating good/bad (values are {0,1,2,3,4})
 * @param {number} size - font size
 * @returns {Object} JSX rendered component
 */
function moodIcon(mood, size) {
  switch (mood) {
    case 0:
      return (<MaterialIcons name="thumb-up" size={size} color={indicator0} />);
    case 1:
      return (<MaterialIcons name="thumb-up" size={size} color={indicator1} />);
    case 2:
      return (<MaterialIcons name="thumb-up" size={size} color={indicator2} />);
    case 3:
      return (<MaterialIcons name="thumb-down" size={size} color={indicator3} />);
    case 4:
      return (<MaterialIcons name="thumb-down" size={size} color={indicator4} />);
    default:
      return (<MaterialIcons name="thumb-up" size={size} />);
  }
}

export {
  OverviewItemSidejobs,
  OverviewItemVotes,
  OverviewItemSpeeches,
  OverviewItemQuestions,
  NavIconHome,
  NavIconProfile,
  NavIconPersonal,
  NavIconSpeech,
  NoConnection,
  moodIcon,
};
