import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import Event from 'screens/Events/components/Event';
import { useStores } from 'store';

import styles from './styles';

const Events = observer(() => {
  const { eventStore } = useStores();

  useEffect(() => {
    eventStore.fetchEvents();
  }, [eventStore]);

  return (
    <FlatList
      contentContainerStyle={{ backgroundColor: '#dce775' }}
      data={eventStore.events.slice()}
      onRefresh={eventStore.fetchEvents}
      renderItem={({ item, index }) => {
        return <Event event={toJS(item)} key={index} />;
      }}
      refreshing={eventStore.fetching}
    />
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
