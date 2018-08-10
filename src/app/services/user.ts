import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData, User } from '../models/user';
import { getBaseUrl } from '../env';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getUsers() {
    return this.http
      .get(getBaseUrl('users'))
      .pipe(map((response: User[]) => response.map(user => new User(user))));
  }

  public getUser() {
    return this.http.get(getBaseUrl('user'));
  }

  public addUser(userData: UserData) {
    return this.http.post(getBaseUrl('users'), userData);
  }

  public removeUser(user: User) {
    return this.http.delete(getBaseUrl(`users/${user.id}`));
  }

  public updateUser(userId: number, userData: UserData) {
    return this.http.patch(getBaseUrl(`users/${userId}`), userData);
  }
}
