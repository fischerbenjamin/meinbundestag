import React from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { seperator } from '../../style/Lists';

/**
 * @author Benjamin Fischer
 * @description Implementation of the PersonalCollapsable component
 */

/**
 * @classdesc
 * This class represents a collapsable view in the profile screen.
 * @extends React.PureComponent
 */
export default class PersonalCollapsable extends React.PureComponent {
  /**
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const { data, renderListItem, onPressItem } = this.props;
    return (
      <View>
        <FlatList
          data={data}
          numColumns={1}
          renderItem={({ item }) => renderListItem(item, onPressItem)}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View style={seperator.default} />
          )}
        />
      </View>
    );
  }
}

/**
 * @description Properties of the component
 * @property {Object} data - data to render
 * @property {function} renderListItem - callback for rendering one item of the data
 * @property {function} onPressItem - callback when item is pressed
 */
PersonalCollapsable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  renderListItem: PropTypes.func.isRequired,
  onPressItem: PropTypes.func.isRequired,
};
