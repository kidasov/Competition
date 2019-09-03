import { Component, Input, OnInit } from '@angular/core';
import { Attendee } from 'app/models/attendee';
import { DetailedEvent } from 'app/models/event';
import { EventService } from 'app/services/event';
import { Id } from 'app/types/types';

@Component({
  selector: 'app-attendee-table',
  templateUrl: './attendee-table.component.html',
  styleUrls: ['./attendee-table.component.css'],
})
export class AttendeeTableComponent implements OnInit {
  @Input()
  attendees: Attendee[] = [];
  @Input()
  event: DetailedEvent;

  constructor(private eventService: EventService) {}

  accept(userId: Id) {
    this.eventService
      .accept(this.event.id, userId, {})
      .subscribe();
    return false;
  }

  kick(userId: Id) {
    this.eventService
      .removeUser(this.event.id, userId)
      .subscribe();
    return false;
  }

  ngOnInit() {
    console.log("Attendee", this.attendees);
  }
}
