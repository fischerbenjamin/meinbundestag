import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import React from 'react';
import Suggestions from '../components/Suggestions';


import style from '../style/Home';
import storage from '../storage/Store';
import { NavIconHome } from '../style/Icons';
import utils from '../resources/Utils';
import { colorMain } from '../style/Colors';


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      isLoading: false,
      errorMessage: '',
    };
    this.deputies = [];
  }

  async componentDidMount() {
    this.deputies = await utils.getDeputies();
  }

  static navigationOptions = {
    tabBarIcon: NavIconHome,
  };

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

  async doSearch() {
    const { query, selected } = this.state;
    if (query === '' || !selected) {
      return;
    }
    this.setState({ isLoading: true });
    const { navigate } = this.props.navigation;
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
    this.setState({ query: '', isLoading: false });
    navigate('profile');
  }

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

  renderActivityIndicator() {
    const { isLoading } = this.state;
    if (!isLoading) return null;
    return (
      <View
        style={{
          margin: 10,
          marginBottom: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colorMain} />
      </View>
    );
  }

  renderErrorMessage() {
    const { errorMessage } = this.state;
    if (errorMessage !== '') {
      return (
        <View
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            marginBottom: 30,
          }}
        >
          <Text
            style={{ color: 'red', fontStyle: 'italic' }}
          >
            Profil
            &apos;
            {errorMessage}
            &apos;
            konnte nicht gefunden werden.
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    const { query, selected } = this.state;
    const deputies = selected ? [] : this.findSugggestions(query);
    return (
      <View style={style.container}>
        <View style={style.inputView}>
          <TextInput
            style={{
              padding: 15,
              margin: 10,
              marginTop: 20,
              fontSize: 18,
              borderWidth: 2,
              borderRadius: 20,
              textAlign: 'center',
              outline: 'none',
              borderColor: colorMain,
              fontWeight: 500,
            }}
            autoFocus
            autoCorrect={false}
            onChangeText={(text) => {
              this.setState({
                query: text,
                errorMessage: '',
                selected: false,
              });
            }}
            value={query}
          />
        </View>
        <View
          style={{
            flex: 4,
            alignItems: 'center',
          }}
        >
          <Suggestions
            suggestions={deputies}
            itemCallback={(item) => this.setState({ query: item, selected: true })}
          />
        </View>
        <View style={{ flex: 1 }}>
          {this.renderSearchButton()}
        </View>
        <View style={{ flex: 1 , marginTop: 20 }}>
          {this.renderActivityIndicator()}
          {this.renderErrorMessage()}
        </View>
      </View>
    );
  }
}
