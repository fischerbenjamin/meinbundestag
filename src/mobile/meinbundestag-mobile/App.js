import React from 'react';
import { FlatList, ActivityIndicator, Text, View  } from 'react-native';

export default class FetchExample extends React.Component {

  constructor(props){
    console.error("IAOF")
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    console.log("asaff")
    return fetch('http://localhost:3000/info')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.speakers.names)
        this.setState({
          isLoading: false,
          dataSource: responseJson.speakers.names,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:20, alignSelf:"center"}}>
        <FlatList
          data={this.state.dataSource}
            renderItem={({item}) => <Text>{item} Hallo</Text>}
        />
      </View>
    );
  }
}
