import React, {Component} from 'react';
import {View} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';

import * as Routes from 'constants/routes';
import Login from 'screens/Login';

const Navigator = createSwitchNavigator({
  [Routes.LOGIN]: {
    screen: Login,
  },
});

const NavigatorApp = createAppContainer(Navigator);

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
