import React from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';

import { isToday } from '@/lib/date';

import Report from '@/components/Report';

const keyExtractor = (item, index) => `${item.id}${item.applicable_date}${index}`;

const Location = ({ location, reports, height }) => {
  const { width } = Dimensions.get('window');

  const report = reports[location.woeid] || {};
  const weather = report.weather || [];

  const renderReport = ({ item }) => (
    <Report location={location} report={report} weather={item}  />
  );

  const todayWeatherIndex = weather.findIndex(w => {
    return isToday(w.applicable_date);
  });

  const getItemLayout = (_data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View style={{ height: height - 10, marginBottom: 10 }}>
      <View style={{ marginBottom: 10 }}>
        <Text h2>{location.title}</Text>
      </View>
      <FlatList
        horizontal
        keyExtractor={keyExtractor}
        data={weather}
        renderItem={renderReport}
        ListEmptyComponent={<Report />}
        snapToInterval={width}
        snapToAlignment="center"
        initialScrollIndex={todayWeatherIndex}
        getItemLayout={getItemLayout}
      />
    </View>
  );
};

const mapStateToProps = state => ({
  reports: state.reports,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Location);
