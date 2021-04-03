import api from 'api';
import { makeObservable, action, computed, observable } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthStore {
  sessionKey: string = null;
  userId: number = null;

  constructor() {
    makeObservable(this, {
      sessionKey: observable,
      userId: observable,
      isAuthorized: computed,
      checkAuth: action,
      signIn: action,
    });
  }

  get isAuthorized() {
    return !!this.sessionKey;
  }

  async checkAuth() {
    const cachedAuth = await AsyncStorage.getItem('auth');
    if (cachedAuth) {
      const { sessionKey, userId } = JSON.parse(cachedAuth);
      this.sessionKey = sessionKey;
      this.userId = userId;
    }
  }

  async signIn(payload) {
    const { sessionKey, userId } = await api.post('/auth/signin', payload);
    this.sessionKey = sessionKey;
    this.userId = userId;

    AsyncStorage.setItem('auth', JSON.stringify({ sessionKey, userId }));
  }

  async logout() {
    await AsyncStorage.removeItem('auth');
    this.sessionKey = null;
    this.userId = null;
  }
}
