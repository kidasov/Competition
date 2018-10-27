import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'app/models/user';
import * as moment from 'moment';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent implements OnInit {
  @Input()
  users: User[] = [];
  @Output()
  remove = new EventEmitter();
  @Output()
  edit = new EventEmitter();

  public formatDate(date: string) {
    return moment(date).format('MMM D, YYYY, HH:mm ');
  }

  public removeUser(user: User) {
    this.remove.emit(user);
  }

  public editUser(user: User) {
    this.edit.emit(user);
  }

  ngOnInit() {}
}
