import { Component, OnInit } from '@angular/core';
import { User, UserData} from 'app/models/user';
import { UserService } from 'app/services/user';
import { Id } from 'app/types/types';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit {
  users: User[] = [];
  user: User = null;
  editedUser: User = null;
  showAddUser = false;
  showEditUser = false;

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

  public updateUser(userId: Id, userData: UserData) {
    this.userService.patchUser(userId, userData).subscribe(user => {
      this.users = this.users.map(u => {
        return u.id === userId
          ? {
              ...u,
              ...user,
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
