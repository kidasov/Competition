import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react';

import { useStores } from 'store';
import Event from 'screens/Events/components/Event';

import styles from './styles';

const Events = observer(() => {
  const { eventStore } = useStores();

  useEffect(() => {
    eventStore.fetchEvents();
  }, [eventStore]);

  return (
    <View style={styles.container}>
      {eventStore.events.map(event => (
        <Event event={event} />
      ))}
    </View>
  );
});

Events.navigationOptions = props => {
  return {
    title: 'Competitions',
    headerLeft: (
      <View style={styles.hamburger}>
        <Icon
          name="menu"
          onPress={() => props.navigation.toggleDrawer()}
          size={24}
          color="black"
        />
      </View>
    ),
  };
};

export default Events;
