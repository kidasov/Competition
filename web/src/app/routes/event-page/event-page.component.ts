import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from 'app/consts/common';
import { Attendee } from 'app/models/attendee';
import { DetailedEvent } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { EventService } from 'app/services/event';
import { TimeService } from 'app/services/time';
import { Id } from 'app/types/types';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
})
export class EventPageComponent implements OnInit, OnDestroy {
  event: DetailedEvent;
  authorized: boolean;
  showEdit = false;
  coverMediaId: number;
  previewCoverImage: string = null;
  subscription = new Subscription();
  sidebarActions: string[] = ['edit-event'];
  countdownTimer = null;
  currentTime = moment();

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
    private timeService: TimeService,
    private router: Router,
  ) {}

  get participants(): Attendee[] {
    return this.event.attendees;
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

  get eventId() {
    return this.event.id;
  }

  get eventType() {
    return this.event.type === 'single' ? 'Личное первенство' : 'Командное первенство';
  }

  get eventDescription() {
    return this.event.description || 'Соревнование по настольному теннису';
  }

  get canRegister() {
    return (
      !this.authorized ||
      !this.event.attendees.find(
        pretender => pretender.userId === this.authProvider.userId,
      )
    );
  }

  get name() {
    return this.event.name;
  }

  get location() {
    return this.event.location;
  }

  get startDate() {
    return moment(this.event.startsAt)
      .lang('ru')
      .format('D MMMM YYYY, HH:mm');
  }

  get endDate() {
    return moment(this.event.endsAt)
      .lang('ru')
      .format('D MMMM YYYY, HH:mm');
  }

  get attendees() {
    return this.event.attendees.length;
  }

  get description() {
    return this.event.description;
  }

  get isStartDateValid() {
    return moment(this.event.startsAt).isValid();
  }

  get isEndDateValid() {
    return moment(this.event.endsAt).isValid();
  }

  get isPair() {
    return this.event.type === 'pair';
  }

  get isSingle() {
    return this.event.type === 'single';
  }

  ngOnInit() {
    this.countdownTimer = setInterval(() => {
      this.currentTime = moment();
    }, 1000);

    const eventId = this.route.snapshot.params.eventId;
    this.eventService.setEventId(eventId);
    this.fetchEvent();
    this.subscription.add(
      this.eventService.getEvent(eventId).subscribe(event => {
        this.event = event;
      }),
    );
    this.subscription.add(
      this.authProvider.userInfo.subscribe(userInfo => {
        this.authorized = userInfo.authorized;
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.countdownTimer);
  }

  fetchEvent = () => {
    const eventId = this.route.snapshot.params.eventId;
    this.eventService.fetchEvent(eventId);
  };

  register() {
    const eventId = this.route.snapshot.params.eventId;
    if (this.authorized) {
      this.eventService
        .register(eventId, { role: 'participant' })
        .subscribe(this.fetchEvent);
    }
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

  get image() {
    return this.event.coverMediaId != null
        ? `${API_URL}/storage/${this.event.coverMediaId}`
        : '/assets/timo.jpg';
  }


  get timeEndsRegAt() {
    const endsRegAt = moment(this.event.endsRegAt);
    if (!this.event.endsRegAt || endsRegAt < this.currentTime) {
      return null;
    }
    return this.timeService.timeDiff(moment(this.event.endsRegAt), this.currentTime);
  }

  get timeLeft() {
    if (!this.event.startsAt || moment(this.event.startsAt) < this.currentTime) {
      return null;
    }
    return this.timeService.timeDiff(moment(this.event.startsAt), this.currentTime);
  }
}