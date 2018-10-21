import { Injectable } from '@angular/core';
import { UserData, User } from '../models/user';
import { map } from 'rxjs/operators';
import { ApiService } from './api';
import { Id } from 'app/types/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private api: ApiService) {}

  public getUsers() {
    return this.api
      .get('/users')
      .pipe(map((response: User[]) => response.map(user => new User(user))));
  }

  public getUser(userId: Id) {
    return this.api.get(`/users/${userId}`);
  }

  public addUser(userData: UserData) {
    return this.api.post('/users', userData);
  }

  public removeUser(user: User) {
    return this.api.delete(`/users/${user.id}`);
  }

  public updateUser(userId: Id, userData: UserData) {
    return this.api.patch(`/users/${userId}`, userData);
  }
}
