import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Autocomplete from 'react-native-autocomplete-input';

import style from '../style/Home';
import storage from '../storage/Store';
import { NavIconHome } from '../style/Icons';
import api from '../resources/Api';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deputies: [],
      query: '',
    };
  }

  async componentDidMount() {
    const allNames = await api.deputies();
    this.setState({ deputies: allNames });
  }

  static navigationOptions = {
    tabBarIcon: NavIconHome,
  };

  findProfile(query) {
    if (query === '') {
      return [];
    }
    const { deputies } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    const matches = deputies.filter((profile) => profile.search(regex) >= 0);
    const suggestions = matches.slice(0, 10).sort(
      (a, b) => (a.length - b.length),
    );
    return suggestions;
  }

  async updateProfile() {
    const { query } = this.state;
    const profile = await api.profile(query);
    storage.setProfile(profile);
  }

  renderSearchButton() {
    const { navigate } = this.props.navigation;
    return (
      <View style={style.buttonView}>
        <TouchableOpacity
          style={style.button}
          onPress={async () => {
            await this.updateProfile();
            storage.setSpeech({});
            navigate('profile');
          }}
        >
          <Text style={style.buttonText}>
            Suchen
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { query } = this.state;
    const deputies = this.findProfile(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={style.container}>
        <View style={style.inputView}>
          <Autocomplete
            containerStyle={style.inputContainer}
            inputContainerStyle={style.input}
            value={query}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Name des Abgeordneten"
            data={
              deputies.length === 1
              && comp(query, deputies[0]) ? [] : deputies
            }
            onChangeText={(text) => { this.setState({ query: text }); }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={async () => {
                  this.setState({ query: item });
                }}
              >
                <Text style={style.inputSuggestionText}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {this.renderSearchButton()}
      </View>
    );
  }
}
