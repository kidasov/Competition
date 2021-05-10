import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import * as Routes from 'constants/routes';


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
    const fetchEvents = () => eventStore.fetchEvents();
    navigation.addListener('focus', fetchEvents);

    return () => navigation.removeListener('focus', fetchEvents);
  }, []);

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={eventStore.events.slice()}
      onRefresh={eventStore.fetchEvents}
      renderItem={({ item, index }) => {
        return <Event event={toJS(item)} key={index} onPress={() => navigation.navigate(Routes.EVENT, {
          event: item,
        })} />;
      }}
      refreshing={eventStore.fetching}
    />
  );
});

export default Events;
