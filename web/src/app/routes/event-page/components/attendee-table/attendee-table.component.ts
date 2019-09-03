import { Component, Input, OnInit } from '@angular/core';
import { Attendee } from 'app/models/attendee';

@Component({
  selector: 'app-attendee-table',
  templateUrl: './attendee-table.component.html',
  styleUrls: ['./attendee-table.component.css'],
})
export class AttendeeTableComponent implements OnInit {
  @Input()
  attendees: Attendee[] = [];

  constructor() {}

  ngOnInit() {}
}
