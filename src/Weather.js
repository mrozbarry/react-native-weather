import React, { Component } from 'react';
import { Dimensions, FlatList, SafeAreaView, TextInput } from 'react-native';
import { Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { debounce } from 'lodash';

import * as Actions from '@/actions';
import Location from '@/components/Location';

class Weather extends Component {
  state = {
    height: 0,
  };

  onLayoutChange = ({ nativeEvent }) => {
    this.setState({ height: nativeEvent.layout.height });
  };

  locationsFetch = debounce((query) => (
    this.props.locationsFetch(query)
  ), 1000);

  // componentDidMount() {
  //   this.locationsFetch('');
  // }

  renderLocation = ({ item }) => {
    const height = this.state.height || Dimensions.get('window').height;

    return <Location location={item} height={height} />;
  };

  locationKeyExtractor = item => item.woeid.toString();

  render() {
    const { locations } = this.props;
    const height = this.state.height || Dimensions.get('window').height;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TextInput
          onChangeText={this.locationsFetch}
          style={{
            margin: 10,
            padding: 10,
            fontSize: 18,
            borderWidth: 1,
            borderColor: '#eee',
            borderRadius: 5,
          }}
        />
        <FlatList
          style={{ flex: 1, width: '100%' }}
          data={locations.data}
          renderItem={this.renderLocation}
          keyExtractor={this.locationKeyExtractor}
          refreshing={locations.loading}
          onRefresh={() => this.locationsFetch(locations.query)}
          onLayout={this.onLayoutChange}
          snapToInterval={height}
          snapToAlignment="center"
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  locations: state.locations,
});

const mapDispatchToProps = {
  locationsFetch: Actions.locationsFetch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Weather);
