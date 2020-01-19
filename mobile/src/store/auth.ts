import api from 'api';
import { observable, action, computed } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';


export default class AuthStore {
  @observable sessionKey = null;
  @observable userId = null;

  @computed
  get isAuthorized() {
    return !!this.sessionKey;
  }

  @action
  async checkAuth() {
    const cachedAuth = await AsyncStorage.getItem('auth');
    if (cachedAuth) {
      const { sessionKey, userId } = JSON.parse(cachedAuth);
      this.sessionKey = sessionKey;
      this.userId = userId;
    }
  }

  @action
  async signIn(payload) {
    const { sessionKey, userId } = await api.post('/auth/signin', payload);
    this.sessionKey = sessionKey;
    this.userId = userId;

    AsyncStorage.setItem('auth', JSON.stringify({ sessionKey, userId }))
  }
}