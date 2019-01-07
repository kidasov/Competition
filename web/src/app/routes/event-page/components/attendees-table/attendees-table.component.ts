import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Attendee, EventType } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { Id } from 'app/types/types';

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
  @Input()
  type: EventType;
  @Output()
  add = new EventEmitter();
  @Output()
  remove = new EventEmitter();

  constructor(private authProvider: AuthProvider, private router: Router) {}

  ngOnInit() {}

  isPaired(index) {
    return this.type === 'pair' ? Math.floor(index / 2) + 1 : index + 1;
  }

  handleAdd(attendee: Attendee) {
    this.add.emit(attendee.userId);
  }

  handleRemove(attendee: Attendee) {
    this.remove.emit(attendee.userId);
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

  navigateToUserPage(userId: Id) {
    this.router.navigate(['users', userId]);
  }
}
