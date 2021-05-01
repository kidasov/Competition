import { createStackNavigator } from '@react-navigation/stack';
import { useStores } from 'store';
import * as Routes from 'constants/routes';
import Logout from 'screens/Logout';
import Login from 'screens/Login';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { authStore } = useStores();
  return (
    <Stack.Navigator>
      {authStore.isAuthorized ? <Stack.Screen name={Routes.LOGOUT} component={Logout} />
      : <Stack.Screen name={Routes.LOGIN} component={Login} />}
    </Stack.Navigator>
  );
}

export default AuthNavigator;