import React from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';

const Events = () => {
  return (
    <View>
      <Text>Competitions screen</Text>
    </View>
  );
};

Events.navigationOptions = props => {
  return {
    title: 'Home',
    headerLeft: (
      <Icon
        name="menu"
        onPress={() => props.navigation.toggleDrawer()}
        size={24}
        color="black"
      />
    ),
  };
};

export default Events;
