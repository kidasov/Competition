import api from 'api';
import { action, observable } from 'mobx';

export default class EventsStore {
  @observable events = [];
  @observable fetching = false;

  @action
  async fetchEvents() {
    this.fetching = true;
    this.events = await api.get('/events');
    this.fetching = false;
  }
}
