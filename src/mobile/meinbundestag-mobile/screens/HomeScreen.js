import React from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavIconHome } from "../style/Icons";
import Basic from "../style/Views";
import ScreenName from '../components/ScreenName';

//import all the components we are going to use.
import Autocomplete from 'react-native-autocomplete-input';
//import Autocomplete component

export default class HomeScreen extends React.Component {
  
  static navigationOptions = {
    tabBarIcon: NavIconHome
  };
  
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      query: "",
      wasSet: false,
    };
  }

  componentDidMount(){
    return (
      this.setState({
        profiles: [
          "Albert",
          "Berta",
          "Christoph",
          "David",
          "Devid",
          "devud"
        ],
      })
    )
  }

  findProfile(query) {
    if (query === '') {
      return [];
    }
    const { profiles } = this.state;
    const regex = new RegExp(`${query.trim()}`, 'i');
    return profiles.filter(profile => profile.search(regex) >= 0);
  }

  render() {
    const { query } = this.state;
    console.log("Got called with query " + query);
    console.log(this.state.wasSet);
    const {navigate} = this.props.navigation;
    const profiles = this.findProfile(query);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={styles.autocompleteContainer}
          //data to show in suggestion
          data={profiles.length === 1 && comp(query, profiles[0]) ? [] : profiles}
          //default value if you want to set something in input
          defaultValue={query}
          /*onchange of the text changing the state of the query which will trigger
          the findFilm method to show the suggestions*/
          onChangeText={(text) => {
            if (this.state.wasSet) {
              console.log("oooo");
              this.setState({query: "BOOOM"})
            } else {
              this.setState({query: text})
            }
          }}
          placeholder="Enter the film title"
          renderItem={({ item }) => (
            //you can change the view you want to show in suggestion from here
            <TouchableOpacity onPress={() => {
              console.log("HITME")
              console.log(item);
              navigate('profile', {name: item})
            }}>
              <Text style={styles.itemText}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    padding: 16,
    marginTop: 40,
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 0,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 2,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
  },
});