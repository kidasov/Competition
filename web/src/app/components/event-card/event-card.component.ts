import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from 'app/consts/common';
import { EventWithUsers } from 'app/models/event';
import { TimeService } from 'app/services/time';
import * as moment from 'moment';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent implements OnInit {
  @Input()
  event: EventWithUsers;
  currentTime = moment();
  faClock = faClock;

  get name() {
    return this.event.name;
  }

  get date() {
    return moment(this.event.startsAt)
      .lang('ru')
      .format('D MMMM YYYY, HH:mm');
  }

  get image() {
    const imageUrl =
      this.event.coverMediaId != null
        ? `${API_URL}/storage/${this.event.coverMediaId}`
        : '/assets/timo.jpg';

    return `${imageUrl}`;
  }

  showEvent(event: Event) {
    this.router.navigate(['events', this.event.id]);
    event.preventDefault();
  }

  constructor(private router: Router, private timeService: TimeService) {}

  ngOnInit() {}

  get timeLeft() {
    if (
      !this.event.startsAt ||
      moment(this.event.startsAt) < this.currentTime
    ) {
      return null;
    }
    return this.timeService.timeDiff(
      moment(this.event.startsAt),
      this.currentTime,
    );
  }
}
