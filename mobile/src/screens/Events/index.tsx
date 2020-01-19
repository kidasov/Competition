import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {observer} from 'mobx-react';
import {useStores} from 'store';

const Events = observer(() => {
  const {eventStore} = useStores();

  useEffect(() => {
    eventStore.fetchEvents();
  }, []);

  return (
    <View>
      <Text>Competitions screen</Text>
    </View>
  );
});

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
