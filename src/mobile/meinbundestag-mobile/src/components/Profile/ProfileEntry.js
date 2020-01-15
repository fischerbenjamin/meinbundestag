import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

import { listItem as style } from '../../style/Lists';

/**
 * @author Benjamin Fischer
 * @description Implementation of the ProfileEntry component
 */

/**
 * @classdesc
 * This class represents a single entry in the profile page. An entry is an
 * abstraction of a key/value pair, e.g "Name" and the actual name of the deputy
 * @extends React.PureComponent
 */
class ProfileEntry extends React.PureComponent {
  /**
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const { description, value } = this.props;
    return (
      <View style={style.container}>
        <View style={style.keyView}>
          <Text style={style.keyText}>
            {description}
          </Text>
        </View>
        <View style={style.valueView}>
          <Text style={style.valueText}>
            {value}
          </Text>
        </View>
      </View>
    );
  }
}

/**
 * @description Properties of the component
 * @property {string} description - description (key)
 * @property {string|number} value - value
 */
ProfileEntry.propTypes = {
  description: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default ProfileEntry;
