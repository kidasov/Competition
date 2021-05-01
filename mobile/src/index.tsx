import 'react-native-gesture-handler';
import { IntlProvider } from 'react-intl';
import 'intl';
import 'intl/locale-data/jsonp/ru';

import React from 'react';
import { View } from 'react-native';
import MenuNavigator from 'navigation/Menu';

import { NavigationContainer } from '@react-navigation/native';
import { English } from 'translations';

const styles = {
  container: {
    flex: 1,
    fontFamily: 'AlegreyaSans-Regular',
  },
};

const App = () => (
  <IntlProvider locale={'ru'} messages={English}>
    <View style={styles.container}>
      <NavigationContainer>
        <MenuNavigator />
      </NavigationContainer>
    </View>
  </IntlProvider>
);

export default App;
