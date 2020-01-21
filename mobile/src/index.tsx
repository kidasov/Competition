import 'react-native-gesture-handler';

import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import * as Routes from 'constants/routes';
import Login from 'screens/Login';
import Events from 'screens/Events';
import Splash from 'screens/Splash';
import Logout from 'screens/Logout';

const MainStack = createStackNavigator({
  [Routes.EVENTS]: {
    screen: Events,
  },
});

const LoginStack = createSwitchNavigator({
  [Routes.SPLASH]: {
    screen: Splash,
  },
  [Routes.LOGIN]: {
    screen: Login,
  },
});

const LogoutStack = createStackNavigator({
  [Routes.LOGOUT]: {
    screen: Logout,
  },
});

const DrawerNavigator = createDrawerNavigator({
  Main: MainStack,
  Logout: LogoutStack,
});

const SwitchNavigator = createSwitchNavigator({
  Login: LoginStack,
  Drawer: DrawerNavigator,
});

const NavigatorApp = createAppContainer(SwitchNavigator);

const App = () => (
  <View style={styles.container}>
    <NavigatorApp />
  </View>
);

const styles = {
  container: {
    flex: 1,
  },
};

export default App;
