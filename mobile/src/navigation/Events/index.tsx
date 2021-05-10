import { createStackNavigator } from '@react-navigation/stack';
import Events from 'screens/Events';
import Event from 'screens/Event';
import * as Routes from 'constants/routes';
import { observer } from 'mobx-react-lite';
import Header from 'components/Header';


export type EventsNavigatorParamList = {
  [Routes.EVENTS]: {},
  [Routes.EVENT]: {
    event: Event,
  },
}

const Stack = createStackNavigator<EventsNavigatorParamList>();

const EventsNavigator = observer(() => (
  <Stack.Navigator>
    <Stack.Screen
      name={Routes.EVENTS}
      component={Events}
      options={({ navigation }) => ({
        headerTitle: 'Соревнования',
        headerLeft: () => <Header onPress={navigation.toggleDrawer} />,
      })}
    />
    <Stack.Screen
      name={Routes.EVENT}
      component={Event}
    />
  </Stack.Navigator>
));

export default EventsNavigator;
