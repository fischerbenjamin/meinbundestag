import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { entry } from '../../style/Profile';


class ProfileEntry extends React.PureComponent {
  render() {
    const { description, value } = this.props;
    return (
      <View style={entry.container}>
        <View style={entry.descriptionView}>
          <Text style={entry.descriptionText}>
            {description}
          </Text>
        </View>
        <View style={entry.valueView}>
          <Text style={entry.valueText}>
            {value}
          </Text>
        </View>
      </View>
    );
  }
}

ProfileEntry.propTypes = {
  description: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default ProfileEntry;
