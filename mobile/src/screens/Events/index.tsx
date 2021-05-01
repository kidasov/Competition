import React, { FC, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

import Event from 'screens/Events/components/Event';
import { useStores } from 'store';

import styles from './styles';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export type EventsScreenNavigationProp = DrawerNavigationProp<{}>;

export type EventsScreenProps = {
  navigation: EventsScreenNavigationProp,
};

const Events = observer(({ navigation }: EventsScreenProps) => {
  const { eventStore } = useStores();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      eventStore.fetchEvents();
    });

    return unsubscribe;
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.content}
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
