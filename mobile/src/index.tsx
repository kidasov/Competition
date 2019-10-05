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

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavigatorApp />
      </View>
    );
  }
}

export default App;

const styles = {
  container: {
    flex: 1,
  },
};
