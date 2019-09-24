import { Injectable } from '@angular/core';
import { Id } from 'app/types/types';
import { BehaviorSubject, empty, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Attendee } from '../models/attendee';
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
  _currentEventId = new BehaviorSubject<Id>(-1);
  _currentEvent: Observable<DetailedEvent>;
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
    this.api.get(`/events/${eventId}`).subscribe((event: DetailedEvent) => {
      event.attendees = event.attendees.map(attendee => new Attendee(attendee));
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
    ).pipe(tap(() => this.fetchEvent(eventId)));
  }

  public removeUser(eventId: Id, userId: Id): Observable<void> {
    return this.api.delete(`/events/${eventId}/attendees/${userId}`).pipe(tap(() => this.fetchEvent(eventId)));
  }

  public patchEvent(eventId: Id, params: PatchEventParams): Observable<Event> {
    const { startsAt, endsAt, ...rest } = params;

    return this.api.patch(`/events/${eventId}`, {
      startsAt: startsAt instanceof Date ? startsAt.toISOString() : startsAt,
      endsAt: endsAt instanceof Date ? endsAt.toISOString() : endsAt,
      ...rest,
    }).pipe(tap(() => this.fetchEvent(eventId)));
  }

  public pairWithUser(eventId: Id, targetUserId: Id): void {
    this.api
      .post(`/events/${eventId}/attendees/pair`, {
        targetUserId,
      })
      .subscribe(() => this.fetchEvent(eventId));
  }

  public setEventId(eventId: Id) {
    this._currentEventId.next(eventId);
  }

  get currentEvent() {
    if (!this._currentEvent) {
      this._currentEvent = this._currentEventId.pipe(switchMap(eventId => {
        if (eventId !== -1) {
          return this.getEventSubject(eventId);
        }
        return empty();
      }));
    }
    return this._currentEvent;
  }

}
