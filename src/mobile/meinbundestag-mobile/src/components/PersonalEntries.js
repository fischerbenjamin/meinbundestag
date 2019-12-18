import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { listItem } from '../style/Lists';


function renderEntry(key, value) {
  return (
    <View style={listItem.container}>
      <View style={listItem.keyView}>
        <Text style={listItem.keyText}>
          {key}
        </Text>
      </View>
      <View style={listItem.valueView}>
        <Text style={listItem.valueText}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function renderSpeech(item, onPressItem) {
  const date = renderEntry('Datum', item.meta.date);
  const topic = renderEntry('Thema', item.meta.topic);
  return (
    <View>
      <TouchableOpacity onPress={() => onPressItem(item)}>
        {date}
        {topic}
      </TouchableOpacity>
    </View>
  );
}

function renderQuestion(item, onPressItem) {
  const status = (() => {
    let answer = 'beantwortet';
    if (item.answers.length === 0) answer = 'nicht beantwortet';
    return renderEntry('Status', answer);
  })();
  const date = renderEntry('Datum', item.date);
  const category = renderEntry('Kategorie', item.category);
  return (
    <View>
      <TouchableOpacity onPress={() => onPressItem(item)}>
        {date}
        {category}
        {status}
      </TouchableOpacity>
    </View>
  );
}

function renderSidejob(item, onPressItem) {
  const job = renderEntry('Tätigkeit', item.job);
  const category = renderEntry('Kategorie', item.job_category);
  const date = (() => {
    const { start, end } = item.date;
    if ((start !== undefined) && (end !== undefined)) {
      const value = `${start} bis ${end}`;
      return renderEntry('Zeitraum', value);
    }
    return null;
  })();
  const organization = renderEntry('Organisation', item.organization);
  return (
    <View>
      <TouchableOpacity onPress={() => onPressItem(item)}>
        {date}
        {category}
        {job}
        {organization}
      </TouchableOpacity>
    </View>
  );
}

function renderVote(item, onPressItem) {
  const date = renderEntry('Datum', item.date);
  const vote = renderEntry('Stimme', item.vote);
  const title = renderEntry('Thema', item.title);
  return (
    <View>
      <TouchableOpacity onPress={() => onPressItem(item)}>
        {date}
        {title}
        {vote}
      </TouchableOpacity>
    </View>
  );
}

export {
  renderSpeech,
  renderQuestion,
  renderSidejob,
  renderVote,
};
