import {
  View,
  Text,
  TouchableOpacity,
  Button,
} from 'react-native';
import React from 'react';
import Autocomplete from 'react-native-autocomplete-input';

import styles from '../style/Views';
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
    return deputies.filter((profile) => profile.search(regex) >= 0).slice(0, 10);
  }

  async updateProfile() {
    const { query } = this.state;
    const profile = await api.profile(query);
    storage.setProfile(profile);
  }

  render() {
    const { query } = this.state;
    const { navigate } = this.props.navigation;
    const deputies = this.findProfile(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={styles.container.basic.centerAll}>
        <Autocomplete
          value={query}
          autoCapitalize="none"
          autoCorrect={false}
          data={deputies.length === 1 && comp(query, deputies[0]) ? [] : deputies}
          onChangeText={(text) => { this.setState({ query: text }); }}
          placeholder="Name des Abgeordneten"
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={async () => {
                this.setState({ query: item });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <Button
          title="Submit"
          onPress={async () => {
            await this.updateProfile();
            navigate('profile');
          }}
        />
      </View>
    );
  }
}
