import React from 'react';
import AuthStore from './auth';

const storesContext = React.createContext({
  authStore: new AuthStore(),
})

export const useStores = () => React.useContext(storesContext);