import React from 'react';
import {
  View,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { seperator } from '../style/Lists';


export default class PersonalCollapsable extends React.PureComponent {
  render() {
    const { data, renderListItem, onPressItem } = this.props;
    return (
      <View>
        <FlatList
          data={data}
          numColumns={1}
          renderItem={({ item }) => renderListItem(item, onPressItem)}
          keyExtractor={(item, index) => index}
          ItemSeparatorComponent={() => (
            <View style={seperator.default} />
          )}
        />
      </View>
    );
  }
}

PersonalCollapsable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  renderListItem: PropTypes.func.isRequired,
  onPressItem: PropTypes.func.isRequired,
};
