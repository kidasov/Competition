import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView, Text } from 'react-native';
import * as Routes from 'constants/routes';
import { EventsNavigatorParamList } from 'navigation/Events';

import styles from './styles';
import { EventsScreenNavigationProp } from 'screens/Events';

export type EventScreenNavigationProp = StackNavigationProp<EventsNavigatorParamList, Routes.EVENTS>;
export type EventScreenRouteProps = RouteProp<EventsNavigatorParamList, Router.EVENTS>;

export type EventProps = {
  navigation: EventsScreenNavigationProp,
  route: EventScreenRouteProps,
};

const Event = (props: EventProps) => {
  const { params: { event } } = props.route;

  console.log('event', event);

  return (
    <SafeAreaView style={styles.container}>
      <Text>{event.name}</Text>
    </SafeAreaView>
  );
};

export default Event;