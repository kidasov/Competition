import { Injectable } from '@angular/core';
import { Notification, NotificationType } from 'app/models/notification';
import { User } from 'app/models/user';
import { Id } from 'app/types/types';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  _notifications = new BehaviorSubject<Notification[]>([]);
  _notificationsFetched = false;
  _unread = new BehaviorSubject<number>(0);
  _unreadFetched = false;

  constructor(private api: ApiService) { }

  private fetchNotifications() {
    return this.api.get('/notifications').pipe(map(notifications => notifications.map(notification => ({
      ...notification,
      sentByUser: new User(notification.sentByUser)
    })))).subscribe(notifications => this._notifications.next(notifications));
  }

  public get unread() {
    if (!this._unreadFetched) {
      this._unreadFetched = true;
      this.fetchUnread();
    }
    return this._unread;
  }

  public removeNotification(notification: Notification) {
    return this.api.delete(`/notifications/${notification.id}`).pipe(tap(() => this.fetchNotifications()));
  }

  public createNotification(type: NotificationType, userId: Id, eventId: Id) {
    return this.api.post(`/notifications`, {
      type, userId, eventId
    });
  }

  public removeNotifications() {
    return this.api.delete('/notifications/all').subscribe(() => this.fetchNotifications());
  }

  public readNotifications() {
    return this.api.post('/notifications/read', {}).subscribe(() => this.fetchUnread());
  }

  private fetchUnread() {
    this.api.get('/notifications/unread').subscribe(({unread}) => this._unread.next(unread));
  }

  get notifications() {
    if (!this._notificationsFetched) {
       this._notificationsFetched = true;
       this.fetchNotifications();
    }
    return this._notifications;
  }
}
