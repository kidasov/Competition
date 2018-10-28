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

  get date() {
    return moment(this.event.createdAt).format('MMMM DD, YYYY, HH:mm');
  }

  get participants() {
    return this.event.users.length;
  }

  get description() {
    return this.event.description;
  }

  get image() {
    return {
      background: `url('${API_URL}/storage/${this.event.coverMediaId}')`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    };
  }

  showEvent() {
    this.router.navigate(['events', this.event.id]);
  }

  constructor(private router: Router) {}

  ngOnInit() {}
}
