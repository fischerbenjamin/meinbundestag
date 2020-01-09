import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

import storage from '../../storage/Store';
import utils from '../../resources/Utils';
import Suggestions from '../../components/Suggestions/Suggestions';

import style from './HomeScreenStyle';
import { colorMain } from '../../style/Colors';
import { NavIconHome } from '../../style/Icons';


/**
 * @author Benjamin Fischer
 * @description Implementation of the HomeScreen component
 */


/**
 * @classdesc
 * This class represents the home screen that is displayed after external
 * data is loaded. It provides a simple search box that is used to search for
 * certain deputy.
 * @extends React.Component
 */
class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      isLoading: false,
      errorMessage: false,
    };
    this.deputies = [];
  }

  /**
   * @method
   * @summary Get the list of all deputies
   * @description
   * Uses the utility method to initialize the deputies. The data should already
   * have been fetched from the server at this point.
   */
  async componentDidMount() {
    this.deputies = await utils.getDeputies();
  }

  // Use the home icon for the screen.
  static navigationOptions = {
    tabBarIcon: NavIconHome,
  };

  /**
   * @method
   * @summary Find matching deputies for the inserted query
   * @description
   * Returns the suggestions in sorted order and at max. 10 items.
   * @param {string} query - query of the user
   * @return {array} array of suggestions matching the query
   */
  findSugggestions(query) {
    if (query === '') {
      return [];
    }
    const { deputies } = this;
    const regex = new RegExp(`${query.trim()}`, 'i');
    const matches = deputies.filter((profile) => profile.search(regex) >= 0);
    const suggestions = matches.slice(0, 10).sort(
      (a, b) => (a.length - b.length),
    );
    return suggestions;
  }

  /**
   * @method
   * @summary Execute the search and navigate to the profile screen
   * @description
   * This method executes the actual search. Therefore, it updates the state
   * accodring to the changes (failure) and stores the new data in the app store.
   */
  async doSearch() {
    const { query, selected } = this.state;
    if (query === '' || !selected) {
      this.setState({ errorMessage: true });
      return;
    }
    this.setState({ isLoading: true });
    const { navigation } = this.props;
    const { navigate } = navigation;
    const profile = await utils.updateProfile(query);
    if (profile === undefined) {
      this.setState({
        isLoading: false,
        errorMessage: query,
        query: '',
        selected: true,
      });
      return;
    }
    storage.setSpeech({});
    this.setState({
      query: '',
      isLoading: false,
    });
    navigate('profile');
  }

  /**
   * @method
   * @summary Render the search button
   * @returns {Object} JSX rendered component
   */
  renderSearchButton() {
    return (
      <View style={style.buttonView}>
        <TouchableOpacity
          style={style.button}
          onPress={() => this.doSearch()}
        >
          <Text style={style.buttonText}>
            Suchen
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * @method
   * @summary Render the activity indicator when data is loading
   * @returns {Object} JSX rendered component
   */
  renderActivityIndicator() {
    const { isLoading } = this.state;
    if (!isLoading) {
      return null;
    }
    return (
      <View style={style.activityIndicatorView}>
        <ActivityIndicator size="large" color={colorMain} />
      </View>
    );
  }

  /**
   * @method
   * @summary Render the error message when no profile was seleceted
   * @returns {Object} JSX rendered component
   */
  renderErrorMessage() {
    const { errorMessage } = this.state;
    if (errorMessage) {
      return (
        <View style={style.activityIndicatorView}>
          <Text style={style.errorMessage}>
            Bitte wählen Sie zuerst ein Profil aus.
          </Text>
        </View>
      );
    }
    return null;
  }

  /**
   * @method
   * @summary Render the component
   * @returns {Object} JSX rendered component
   */
  render() {
    const { query, selected } = this.state;
    const deputies = selected ? [] : this.findSugggestions(query);
    return (
      <View style={style.container}>
        <View style={style.inputView}>
          <TextInput
            style={style.searchBox}
            autoFocus
            autoCorrect={false}
            onChangeText={(text) => {
              this.setState({
                query: text,
                errorMessage: false,
                selected: false,
              });
            }}
            value={query}
          />
        </View>
        <View style={style.suggestionsView}>
          <Suggestions
            suggestions={deputies}
            itemCallback={
              (item) => this.setState({
                query: item,
                selected: true,
                errorMessage: false,
              })
            }
          />
        </View>
        <View style={style.container}>
          {this.renderSearchButton()}
        </View>
        <View style={style.container}>
          {this.renderActivityIndicator()}
          {this.renderErrorMessage()}
        </View>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default HomeScreen;
