import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './BaseScreenStyle';

/**
 * @author Benjamin Fischer
 * @description Implementation of the BaseScreen component.
 */


/**
 * @classdesc
 * This class represents a base screen that is rendered when no data is
 * selected yet. It basically renders a simple message to the user that he
 * must select a profile/speech first in order to proceed.
 * @extends React.PureComponent
 * @property {string} text - the text that is displayed
 */
class BaseScreen extends React.PureComponent {
  /**
   * @method
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const { text } = this.props;
    return (
      <View style={style.container}>
        <Text>
          {text}
        </Text>
      </View>
    );
  }
}

BaseScreen.propTypes = {
  text: PropTypes.string.isRequired,
};

export default BaseScreen;
