import React from 'react';
import AuthStore from './auth';
import EventStore from './events';

export const authStore = new AuthStore();
export const eventStore = new EventStore();

const storesContext = React.createContext({
  authStore,
  eventStore,
});

export const useStores = () => React.useContext(storesContext);
