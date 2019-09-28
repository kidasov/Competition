import { Component, Input, OnInit } from '@angular/core';
import { Notification } from 'app/models/notification';

@Component({
  selector: 'app-notifications-table',
  templateUrl: './notifications-table.component.html',
  styleUrls: ['./notifications-table.component.css']
})
export class NotificationsTableComponent implements OnInit {
  @Input()
  notifications: Notification[];
  
  constructor() { }

  ngOnInit() {
  }

}
