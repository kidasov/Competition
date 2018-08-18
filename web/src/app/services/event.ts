import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event, EventData } from '../models/event';
import { events } from '../mocks/events';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private api: ApiService) {}

  public addEvent(event: EventData) {
    console.log("adding event", event);
    return this.api.post('/events', event);
  }

  public removeEvent(event: Event) {
    return this.api.delete(`/events/${event.id}`);
  }

  public getEvents() {
    // TODO: add user service
    return this.api.get('/events');
  }
}
