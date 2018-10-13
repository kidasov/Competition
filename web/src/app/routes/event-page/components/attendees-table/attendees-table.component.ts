import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Attendee } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';

@Component({
  selector: 'app-attendees-table',
  templateUrl: './attendees-table.component.html',
  styleUrls: ['./attendees-table.component.css'],
})
export class AttendeesTableComponent implements OnInit {
  @Input()
  attendees: Attendee[] = [];
  @Input()
  title: String;
  @Input()
  eventOwner: Boolean = false;
  @Output()
  onAdd = new EventEmitter();
  @Output()
  onRemove = new EventEmitter();

  constructor(private authProvider: AuthProvider) {}

  ngOnInit() {}

  handleAdd(attendee: Attendee) {
    this.onAdd.emit(attendee.userId);
  }

  handleRemove(attendee: Attendee) {
    this.onRemove.emit(attendee.userId);
  }

  showAdd(attendee: Attendee) {
    return this.eventOwner && attendee.status === 'join_request';
  }

  showRemove(attendee: Attendee) {
    return this.eventOwner && this.authProvider.userId !== attendee.userId;
  }

  showLeave(attendee: Attendee) {
    return this.authProvider.userId === attendee.userId;
  }
}
