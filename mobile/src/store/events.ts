import api from 'api';
import { action, observable } from 'mobx';

export default class EventsStore {
  @observable events = [];

  @action
  async fetchEvents() {
    const res = await api.get('/events');

    console.warn("Events", res);
  }
}