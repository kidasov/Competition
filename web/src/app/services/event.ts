import { Injectable } from '@angular/core';
import { Id } from 'app/types/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { DetailedEvent, Event } from '../models/event';
import { ApiService } from './api';

type Role = 'owner' | 'participant' | 'watcher' | 'judge';

interface RegisterParams {
  role: Role;
}
interface AcceptParams {
  role?: Role;
}

interface PatchEventParams {
  name?: string;
  state?: 'published' | 'draft';
  type?: 'single' | 'pair';
  coverMediaId?: Id;
  startsAt?: Date;
  endsAt?: Date;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventSubjects = {};

  constructor(private api: ApiService) {}

  public createEvent(name: String): Observable<Event> {
    return this.api.post('/events', { name });
  }

  public removeEvent(event: Event): Observable<void> {
    return this.api.delete(`/events/${event.id}`);
  }

  public getEvents(): Observable<Event[]> {
    return this.api.get('/events');
  }

  private getEventSubject(eventId): BehaviorSubject<DetailedEvent> {
    let eventSubject = this.eventSubjects[eventId];

    if (!eventSubject) {
      eventSubject = new BehaviorSubject<DetailedEvent>(null);
      this.eventSubjects[eventId] = eventSubject;
    }

    return eventSubject;
  }

  public fetchEvent(eventId: Id): void {
    this.api.get(`/events/${eventId}`).subscribe(event => {
      this.getEventSubject(eventId).next(event);
    });
  }

  public getEvent(eventId: Id): Observable<DetailedEvent> {
    return this.getEventSubject(eventId);
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

  public patchEvent(eventId: Id, params: PatchEventParams): Observable<Event> {
    const { startsAt, endsAt, ...rest } = params;

    return this.api.patch(`/events/${eventId}`, {
      startsAt: startsAt instanceof Date ? startsAt.toISOString() : startsAt,
      endsAt: endsAt instanceof Date ? endsAt.toISOString() : endsAt,
      ...rest,
    });
  }

  public pairWithUser(eventId: Id, targetUserId: Id): void {
    this.api
      .post(`/events/${eventId}/attendees/pair`, {
        targetUserId,
      })
      .subscribe(() => this.fetchEvent(eventId));
  }
}
