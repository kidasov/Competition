import { Injectable } from '@angular/core';
import { Id } from 'app/types/types';
import { BehaviorSubject, combineLatest, empty, Observable } from 'rxjs';
import { map, shareReplay, switchMap, tap  } from 'rxjs/operators';
import { Event } from '../models/event';
import { User, UserData } from '../models/user';
import { ApiService } from './api';
import { AuthProvider } from './auth/provider';

interface PatchUserParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  ttwId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  _currentUser: Observable<User>;
  _userUpdated = new BehaviorSubject<boolean>(false);
  _users: Observable<User[]>;
  constructor(private api: ApiService, private authProvider: AuthProvider) {
    console.log('UserService constructor');
  }

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

  public patchUser(userId: Id, params: PatchUserParams) {
    return this.api.patch(`/users/${userId}`, params)
    .pipe(tap(() => {
      console.log('user service updated user');
      this._userUpdated.next(true);
    }));
  }

  public getEvents(userId: Id): Observable<Event[]> {
    return this.api.get(`/users/${userId}/events`);
  }

  get currentUser() {
    if (!this._currentUser) {
      this._currentUser = combineLatest(this.authProvider.userInfo, this._userUpdated)
      .pipe(
        switchMap(([ userInfo ]) => {
        if (userInfo.userId) {
          return this.api.get(`/users/${userInfo.userId}`);
        }
        return empty();
      }), shareReplay(1));
    }
    return this._currentUser;
  }

  get users() {
    if (!this._users) {
      this._users = this.api
      .get('/users')
      .pipe(map((response: User[]) => response.map(user => new User(user))), shareReplay(1));
    }
    return this._users;
  }
}
