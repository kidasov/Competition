import api from 'api';
import { action, observable } from 'mobx';

export default class EventsStore {
  @observable events = [];

  @action
  async fetchEvents() {
    this.events = await api.get('/events');
  }
}
