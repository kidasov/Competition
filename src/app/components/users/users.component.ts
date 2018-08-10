import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user';
import { User, UserData } from '../../models/user';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  user: User = null;

  constructor(private userService: UserService) {}

  public getUser() {
    this.userService.getUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  public addUser(userData: UserData) {
    this.userService.addUser(userData).subscribe(user => {
      console.log('added user', user);
    });
  }

  public removeUser(user: User) {
    this.userService.removeUser(user).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }

  public updateUser(userId: number, userData: UserData) {
    this.userService.updateUser(userId, userData).subscribe(user => {
      this.users = this.users.map(u => {
        return u.id === userId
          ? {
              ...u,
              ...userData,
            }
          : u;
      });
    });
  }

  public formatDate(date: string) {
    return moment(date).format('MMM d, YYYY, HH:mm ');
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }
}
