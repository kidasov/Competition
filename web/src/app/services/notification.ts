import { Injectable } from '@angular/core';
import { Notification } from 'app/models/notification';
import { User } from 'app/models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private api: ApiService) { }

  public fetchNotifications(): Observable<Notification[]> {
    return this.api.get('/notifications').pipe(map(notifications => notifications.map(notification => ({
      ...notification,
      sentByUser: new User(notification.sentByUser)
    }))));
  }
}
