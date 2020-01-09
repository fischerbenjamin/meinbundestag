import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import style from './SuggestionsStyle';


/**
 * @author Benjamin Fischer
 * @description Implementation of the Suggestion component
 */

/**
 * @classdesc
 * This class is used for displaying the suggestions for a search.
 * @extends React.PureComponent
 */
class Suggestions extends React.PureComponent {
  /**
   * @summary Render a single sugge
   * @param {*} item - suggestion item to render
   * @param {func} callback - function to call when the user clicks on the item
   */
  static renderSuggestion(item, callback) {
    const { name, city } = item.item;
    return (
      <View style={style.suggestionView}>
        <TouchableOpacity onPress={() => callback(name)}>
          <Text style={style.suggestionText}>
            <Text style={style.nameText}>{name}</Text>
            {
              city.length !== 0 && (
                <Text style={style.cityText}>
                  {', '}
                  {city.replace(/,/g, '/')}
                </Text>
              )
            }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const { suggestions, itemCallback } = this.props;
    return (
      <View>
        <FlatList
          data={suggestions}
          renderItem={(suggestion) => Suggestions.renderSuggestion(suggestion, itemCallback)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}


/**
 * @description Properties of the component
 * @property {array} suggestions - list of suggestions
 * @property {func} itemCallback - callback function for each suggestion
 */
Suggestions.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.any).isRequired,
  itemCallback: PropTypes.func.isRequired,
};

export default Suggestions;
