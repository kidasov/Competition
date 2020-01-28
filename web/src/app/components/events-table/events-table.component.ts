import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'app/models/event';
import * as moment from 'moment';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.css'],
})
export class EventsTableComponent implements OnInit {
  @Input()
  events: Event[];

  constructor() {}

  ngOnInit() {
  }

  formatDate(date: string) {
    return moment(date).format('MMM D, YYYY, HH:mm ');
  }
}
