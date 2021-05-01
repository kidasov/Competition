import { createDrawerNavigator } from '@react-navigation/drawer';
import AuthNavigator from 'navigation/Auth';
import { useStores } from 'store';
import EventsNavigator from '../Events';
import * as Routes from 'constants/routes';
import { observer } from 'mobx-react-lite';

const Drawer = createDrawerNavigator();

const MenuNavigator = observer(() => {
  const { authStore } = useStores();
  const authTabName = authStore.isAuthorized ? Routes.LOGOUT : Routes.LOGIN;

  return (
    <Drawer.Navigator>
      <Drawer.Screen name={Routes.EVENTS} component={EventsNavigator} />
      <Drawer.Screen name={authTabName} component={AuthNavigator} />
    </Drawer.Navigator>
  );
});

export default MenuNavigator;
