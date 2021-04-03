import api from 'api';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { Event } from '../types';

export default class EventsStore {
  events: Event[] = [];
  fetching = false;

  constructor() {
    makeObservable(this, {
      events: observable,
      fetching: observable,
      fetchEvents: action,
    });
  }

  async fetchEvents() {
    this.fetching = true;
    const fetchedEvents = await api.get('/events');

    runInAction(() => {
      this.events = fetchedEvents;
      this.fetching = false;
    });
  }
}
