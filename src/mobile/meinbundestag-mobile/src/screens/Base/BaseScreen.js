import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './BaseScreenStyle';

/**
 * BaseScreen
 *  This class represents a base screen that is rendered when no profile is
 *  selected.
 * @extends React.PureComponent
 */
export default class BaseScreen extends React.PureComponent {
  /**
   * Render the component.
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
