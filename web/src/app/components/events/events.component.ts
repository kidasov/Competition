import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Event } from '../../models/event';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService) {}

  removeEvent(event: Event) {
    this.eventService.removeEvent(event).subscribe(() => {
      this.events = this.events.filter(e => e.id !== event.id);
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
