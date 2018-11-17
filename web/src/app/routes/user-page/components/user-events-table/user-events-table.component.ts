import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'app/models/event';
import * as moment from 'moment';

@Component({
  selector: 'app-user-events-table',
  templateUrl: './user-events-table.component.html',
  styleUrls: ['./user-events-table.component.css'],
})
export class UserEventsTableComponent implements OnInit {
  @Input()
  events: Event[] = [];
  @Input()
  title: String;

  constructor() {}

  ngOnInit() {}

  eventDate(number) {
    return moment(this.events[number].startsAt)
      .lang('ru')
      .format('D MMMM YYYY');
  }
}
