import 'react-native-gesture-handler';
import { IntlProvider } from 'react-intl';
import 'intl';
import 'intl/locale-data/jsonp/ru';

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MenuNavigator from 'navigation/Menu';
import LoaderNavigator from 'navigation/Loader';

import { NavigationContainer } from '@react-navigation/native';
import { English } from 'translations';
import { useStores } from 'store';

const styles = {
  container: {
    flex: 1,
    fontFamily: 'AlegreyaSans-Regular',
  },
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const { authStore } = useStores();

  useEffect(() => {
    (async () => {
        await authStore.checkAuth();
        setLoading(false);
    })();
  }, []);

  const renderNavigator = () => {
    return loading ? <LoaderNavigator /> : <MenuNavigator />;
  }

  return (
  <IntlProvider locale={'ru'} messages={English}>
    <View style={styles.container}>
      <NavigationContainer>
        {renderNavigator()}
      </NavigationContainer>
    </View>
  </IntlProvider>
  );
};

export default App;
