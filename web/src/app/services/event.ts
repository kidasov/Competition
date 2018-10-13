import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event, EventData, DetailedEvent } from '../models/event';
import { events } from '../mocks/events';
import { ApiService } from './api';
import { Id } from 'app/types/types';

type Role = 'owner' | 'participant' | 'watcher' | 'judge';

interface RegisterParams {
  role: Role;
}
interface AcceptParams {
  role?: Role;
}

interface PatchEventParams {
  date?: Date;
  name?: String;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private api: ApiService) {}

  public addEvent(event: EventData) {
    return this.api.post('/events', event);
  }

  public removeEvent(event: Event) {
    return this.api.delete(`/events/${event.id}`);
  }

  public getEvents(): Observable<Event[]> {
    return this.api.get('/events');
  }

  public getEvent(eventId: Id): Observable<DetailedEvent> {
    return this.api.get(`/events/${eventId}`);
  }

  public register(eventId: Id, params: RegisterParams): Observable<void> {
    return this.api.post(`/events/${eventId}/attendees/register`, params);
  }

  public accept(
    eventId: Id,
    userId: Id,
    params: AcceptParams,
  ): Observable<void> {
    return this.api.put(
      `/events/${eventId}/attendees/${userId}/accept`,
      params,
    );
  }

  public removeUser(eventId: Id, userId: Id): Observable<void> {
    return this.api.delete(`/events/${eventId}/attendees/${userId}`);
  }

  public patchEvent(eventId: Id, params: PatchEventParams) {
    return this.api.patch(`/events/${eventId}`, params);
  }
}
