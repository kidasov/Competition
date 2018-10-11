import { Component, OnInit } from '@angular/core';
import { EventService } from 'app/services/event';
import { Event } from 'app/models/event';
import * as moment from 'moment';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css'],
})
export class EventsPage implements OnInit {
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
    return moment(date).format('MMM d, YYYY, HH:mm');
  }

  ngOnInit() {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
    });
  }
}
