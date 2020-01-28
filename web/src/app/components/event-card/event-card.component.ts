import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from 'app/consts/common';
import { EventWithUsers } from 'app/models/event';
import * as moment from 'moment';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent implements OnInit {
  @Input()
  event: EventWithUsers;

  get name() {
    return this.event.name;
  }

  get location() {
    return this.event.location;
  }

  get locationSet() {
    return this.event.location != null;
  }

  get date() {
    return moment(this.event.startsAt)
      .lang('ru')
      .format('D MMMM YYYY, HH:mm');
  }

  get dateValid() {
    return moment(this.event.startsAt).isValid();
  }

  get participants() {
    return this.event.users.length;
  }

  get description() {
    return this.event.description;
  }

  get descriptionExist() {
    return this.event.description != null;
  }

  get image() {
    const imageUrl =
      this.event.coverMediaId != null
        ? `${API_URL}/storage/${this.event.coverMediaId}`
        : '/assets/timo.jpg';

    return {
      background: `url(${imageUrl})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    };
  }

  get ownerName() {
    const { owner } = this.event;
    return `${owner.firstName} ${owner.lastName}`;
  }

  showEvent(event: Event) {
    this.router.navigate(['events', this.event.id]);
    event.preventDefault();
  }

  constructor(private router: Router) {}

  ngOnInit() {}
}
