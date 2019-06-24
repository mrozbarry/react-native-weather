import React from 'react';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import { Card, Divider, Icon, Text } from 'react-native-elements';

import { formatDate } from '@/lib/date';

const formatTemp = temp => <Text>{Math.round(temp)}&deg;C</Text>;

const colorWithSatLight = (saturation = 54, lightness = 47) => (
  `hsl(194, ${saturation}%, ${lightness}%)`
);

const colors = {
  clear: colorWithSatLight(54, 47),
  winter: colorWithSatLight(41, 42),
  stormy: colorWithSatLight(54, 43),
  rainy: colorWithSatLight(33, 54),
  cloudy: colorWithSatLight(20, 54),
  lightCloud: colorWithSatLight(40, 54),
}

const WeatherConfig = {
  Snow: {
    background: 'white',
    color: 'black',
    icon: 'cloud-snow',
  },
  Sleet: {
    background: 'white',
    color: 'black',
    icon: 'cloud-snow',
  },
  Hail: {
    background: colors.stormy,
    color: 'white',
    icon: 'cloud-snow',
  },
  Thunderstorm: {
    background: colors.stormy,
    color: 'white',
    icon: 'cloud-lightning',
  },
  'Heavy Rain': {
    background: colors.stormy,
    color: 'white',
    icon: 'cloud-rain',
  },
  'Light Rain': {
    background: colors.lightCloud,
    color: 'white',
    icon: 'cloud-drizzle',
  },
  Showers: {
    background: colors.lightCloud,
    color: 'white',
    icon: 'umbrella',
  },
  'Heavy Cloud': {
    background: colors.stormy,
    color: 'white',
    icon: 'cloud',
  },
  'Light Cloud': {
    background: colors.lightCloud,
    color: 'white',
    icon: 'cloud',
  },
  Clear: {
    background: colors.clear,
    color: 'white',
    icon: 'sun'
  },
};

const CardItem = ({ iconName, title, subtitle, width, color }) => (
  <View style={{ width, paddingHorizontal: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
    <View>
      <Text h3 style={{ color }}>{title}</Text>
      <Text style={{ color }}>{subtitle}</Text>
    </View>
    <Icon size={48} type="feather" name={iconName} color={color} containerStyle={{ marginBottom: 5 }} />
  </View>
);

const ReportWithData = ({ report, weather }) => {
  const { width } = Dimensions.get('window');
  const config = WeatherConfig[weather.weather_state_name];

  return (
    <Card
      title={formatDate(weather.applicable_date)}
      containerStyle={{
        width: width - 30,
        backgroundColor: config.background,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CardItem
        color={config.color}
        width={width - 60}
        iconName={config.icon}
        title={weather.weather_state_name}
        subtitle="Weather Conditions"
      />
      <CardItem
        color={config.color}
        width={width - 60}
        iconName="thermometer"
        title={formatTemp(weather.the_temp)}
        subtitle="Temperature"
      />
      <CardItem
        color={config.color}
        width={width - 60}
        iconName="droplet"
        title={`${Math.round(weather.humidity)}%`}
        subtitle="Humditiy"
      />
      <View style={{ flex: 1 }} />
      <Divider />
      <View style={{ flex: 1 }} />
      <CardItem
        color={config.color}
        width={width - 60}
        iconName="sunrise"
        title={`${report.sun_rise.toLocaleTimeString('en-CA')}`}
        subtitle="Sunrise time"
      />
      <CardItem
        color={config.color}
        width={width - 60}
        iconName="sunset"
        title={`${report.sun_set.toLocaleTimeString('en-CA')}`}
        subtitle="Sunset time"
      />
    </Card>
  );
};

const ReportLoading = () => {
  const { width } = Dimensions.get('window');

  return (
    <Card
      title="Loading"
      containerStyle={{ width: width - 30 }}
    >
      <ActivityIndicator />
    </Card>
  );
};

export default ({ location, report, weather }) => (
  report
    ? <ReportWithData location={location} report={report} weather={weather} />
    : <ReportLoading />
);
