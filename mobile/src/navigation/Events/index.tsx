import { createStackNavigator } from '@react-navigation/stack';
import Events from 'screens/Events';
import * as Routes from 'constants/routes';
import { observer } from 'mobx-react-lite';

const Stack = createStackNavigator();

const EventsNavigator = observer(() => (
  <Stack.Navigator>
    <Stack.Screen name={Routes.EVENTS} component={Events} />
  </Stack.Navigator>
));

export default EventsNavigator;
