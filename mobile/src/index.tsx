import 'react-native-gesture-handler';

import React from 'react';
import { View } from 'react-native';
import MenuNavigator from 'navigation/Menu';

import { NavigationContainer } from '@react-navigation/native';

const styles = {
  container: {
    flex: 1,
    fontFamily: 'AlegreyaSans-Regular',
  },
};

const App = () => (
  <View style={styles.container}>
    <NavigationContainer>
      <MenuNavigator />
    </NavigationContainer>
  </View>
);

export default App;
