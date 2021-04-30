import { createStackNavigator } from '@react-navigation/stack';
import Events from 'screens/Events';

const Stack = createStackNavigator();

const EventsNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={'Events'} component={Events} />
  </Stack.Navigator>
);

export default EventsNavigator;
