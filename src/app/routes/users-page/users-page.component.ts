import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from 'app/services/user';
import { User, UserData } from 'app/models/user';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPage implements OnInit {
  users: User[] = [];
  user: User = null;
  editedUser: User = null;
  showAddUser: boolean = false;
  showEditUser: boolean = false;

  constructor(private userService: UserService) {}

  public addUser(userData: UserData) {
    this.showEditUser = false;
  }

  public showPopup() {
    this.showEditUser = false;
    this.showAddUser = true;
  }

  public closePopup() {
    this.showAddUser = false;
  }

  public closeEditPopup() {
    this.showEditUser = false;
  }

  public removeUser(user: User) {
    this.userService.removeUser(user).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }

  public editUser(user: User) {
    this.showEditUser = true;
    this.editedUser = user;
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

  public fetchUsers() {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  ngOnInit() {
    this.fetchUsers();
  }
}
