import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from 'app/services/event';
import { ActivatedRoute } from '@angular/router';
import { Event, Attendee, DetailedEvent } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { Observable, Subscription } from 'rxjs';
import { Id } from 'app/types/types';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
})
export class EventPageComponent implements OnInit, OnDestroy {
  event: DetailedEvent;
  authorized: boolean;
  subscription: Subscription;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
  ) {}

  get participants(): Attendee[] {
    return this.event.attendees.filter(
      attendee => attendee.status === 'approved',
    );
  }

  get pretenders(): Attendee[] {
    return this.event.attendees.filter(
      attendee => attendee.status === 'join_request',
    );
  }

  get invited(): Attendee[] {
    return this.event.attendees.filter(
      attendee => attendee.status === 'invited',
    );
  }

  get eventOwner(): Boolean {
    return this.authProvider.userId === this.event.ownerUserId;
  }

  ngOnInit() {
    this.fetchEvent();
    this.subscription = this.authProvider.authorized.subscribe(authorized => {
      this.authorized = authorized;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchEvent = () => {
    const eventId = this.route.snapshot.params.eventId;
    this.eventService.getEvent(eventId).subscribe(event => {
      this.event = event;
    });
  };

  register() {
    const eventId = this.route.snapshot.params.eventId;
    this.eventService
      .register(eventId, { role: 'participant' })
      .subscribe(this.fetchEvent);
  }

  accept(userId: Id) {
    this.eventService
      .accept(this.event.id, userId, {})
      .subscribe(this.fetchEvent);
  }

  removeUser(userId: Id) {
    this.eventService
      .removeUser(this.event.id, userId)
      .subscribe(this.fetchEvent);
  }

  isMyself(attendee) {
    return this.authProvider.userId === attendee.userId;
  }
}
