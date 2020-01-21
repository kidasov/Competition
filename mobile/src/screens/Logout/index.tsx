/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useStores } from 'store';
import * as Routes from 'constants/routes';

const logout = async (store, props) => {
  await store.logout();
  props.navigation.navigate(Routes.LOGIN);
};

const Logout = observer(props => {
  const { authStore } = useStores();

  useEffect(() => {
    logout(authStore, props);
  }, []);

  return null;
});

export default Logout;
