import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView
} from 'react-native';
import SidejobEntry from './SidejobEntry';



export default class Sidejobs extends React.PureComponent {
  static renderSeparator = () => {
    return (
      <View
        style={{
          marginBottom: 20,
          marginTop: 20,
          height: 2,
          width: "98%",
          backgroundColor: 'green',
          marginLeft: "1%",
          marginRight: "1%",
        }}
      />
    );
  };
  
  
  render() {
    const { sidejobs, showSidejobs, name } = this.props;
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => this.props.onPress()}
        >
          <Text>{name}</Text>
        </TouchableOpacity>
        <View>
          {
            showSidejobs
            && (
              <View>
                <FlatList
                style={{flex: 1, position: 'relative'}}
                  data={sidejobs}
                  numColumns={1}
                  renderItem={({ item }) => (
                    <SidejobEntry
                      organization={item.organization}
                      dateStart={item.date.start}
                      dateEnd={item.date.end}
                      job={item.job}
                    />
                  )}
                  keyExtractor={(item, index) => index}
                  ItemSeparatorComponent={Sidejobs.renderSeparator}
                />
              </View>
            )
          }
        </View>
      </View>
    );
  }
}
