import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { entry } from '../../style/Profile';


export default class SidejobEntry extends React.PureComponent {
  render() {
    const {
      organization, dateStart, dateEnd, job,
    } = this.props;
    const timeDate = (() => {
      if ((dateStart === undefined) || (dateEnd === undefined)) {
        return undefined;
      }
      return `${dateStart} bis ${dateEnd}`;
    })();
    return (
      <View>
        <View style={entry.container}>
          <View style={entry.descriptionView}>
            <Text style={entry.descriptionText}>
              Organisation
            </Text>
          </View>
          <View style={entry.valueView}>
            <Text style={entry.valueText}>
              {organization}
            </Text>
          </View>
        </View>
        {
          timeDate !== undefined && (
            <View style={entry.container}>
              <View style={entry.descriptionView}>
                <Text style={entry.descriptionText}>
                  Zeitraum
                </Text>
              </View>
              <View style={entry.valueView}>
                <Text style={entry.valueText}>
                  {timeDate}
                </Text>
              </View>
            </View>
          )
        }
        <View style={entry.container}>
          <View style={entry.descriptionView}>
            <Text style={entry.descriptionText}>
              Amt
            </Text>
          </View>
          <View style={entry.valueView}>
            <Text style={entry.valueText}>
              {job}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
