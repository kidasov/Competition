import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from 'app/services/event';
import { ActivatedRoute, Router } from '@angular/router';
import { Event, Attendee, DetailedEvent } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { Observable, Subscription } from 'rxjs';
import { Id } from 'app/types/types';
import { FormGroup, FormControl } from '@angular/forms';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
})
export class EventPageComponent implements OnInit, OnDestroy {
  event: DetailedEvent;
  authorized: boolean;
  subscription: Subscription;
  showEdit = false;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
    private router: Router,
  ) {}

  renameForm = new FormGroup({
    name: new FormControl(),
  });

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

  get canRegister() {
    return (
      this.authorized &&
      !this.event.attendees.find(
        pretender => pretender.userId === this.authProvider.userId,
      )
    );
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

  goBack() {
    this.router.navigateByUrl('/events');
  }

  renameEvent() {
    this.eventService
      .patchEvent(this.event.id, {
        name: this.renameForm.get('name').value,
      })
      .subscribe(() => {
        this.fetchEvent();
        this.showEdit = false;
      });
  }

  showEditPopup() {
    this.showEdit = true;
  }

  closeEditPopup() {
    this.showEdit = false;
  }
}
