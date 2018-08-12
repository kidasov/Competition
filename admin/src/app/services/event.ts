import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event, EventData } from '../models/event';
import { events } from '../mocks/events';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient) {}

  public addEvent(event: EventData) {
    console.log("adding event", event);
    return this.http.post('http://localhost:3003/events', event);
  }     

  public removeEvent(event: Event) {
    return this.http.delete(`http://localhost:3003/events/${event.id}`)
  }

  public getEvents() {
    // TODO: add user service
    return this.http.get('http://localhost:3003/events');
  } 
}
