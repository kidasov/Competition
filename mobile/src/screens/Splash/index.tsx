import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from 'store';
import * as Routes from 'constants/routes';

const checkAuth = async (store, props) => {
  await store.checkAuth();
  props.navigation.navigate(store.isAuthorized ? Routes.EVENTS : Routes.LOGIN);
}

const Splash = observer((props) => {
  const { authStore } = useStores();

  checkAuth(authStore, props);

  return null;
});

export default Splash;