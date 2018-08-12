import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event';
import { Event } from '../../models/event';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService) {}

  addEvent(event: Event) {
    this.eventService.addEvent(event).subscribe(event => {
      console.log('added event', event);
    });
  }

  removeEvent(event: Event) {
    this.eventService.removeEvent(event).subscribe(() => {
      this.events = this.events.filter(e => e.id !== event.id);
      console.log('events', this.events, event.id);
    });
  }

  formatDate(date: string) {
    return moment(date).format('MMM d, YYYY, HH:mm ');
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
    });
  }
}
