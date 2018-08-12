import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User, UserData } from 'app/models/user';
import * as moment from 'moment';

@Component({
  selector: 'users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
})
export class UsersTableComponent implements OnInit {
  @Input()
  users: User[] = [];
  @Output()
  onRemove = new EventEmitter();
  @Output()
  onEdit = new EventEmitter();

  public formatDate(date: string) {
    return moment(date).format('MMM D, YYYY, HH:mm ');
  }

  public removeUser(user: User) {
    this.onRemove.emit(user);
  }

  public editUser(user: User) {
    this.onEdit.emit(user);
  }

  ngOnInit() {}
}
