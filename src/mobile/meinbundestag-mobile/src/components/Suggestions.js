import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';


class Suggestions extends React.PureComponent {
  static renderSuggestion(item, callback) {
    const name = item.item;
    return (
      <View style={{ padding: 5 }}>
        <TouchableOpacity
          onPress={() => callback(name)}
        >
          <Text style={{ textAlign: 'center' }}>{name}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { suggestions, itemCallback } = this.props;
    return (
      <View>
        <FlatList
          data={suggestions}
          renderItem={(suggestion) => Suggestions.renderSuggestion(suggestion, itemCallback)}
        />
      </View>
    );
  }
}

Suggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  itemCallback: PropTypes.func.isRequired,
};

export default Suggestions;
