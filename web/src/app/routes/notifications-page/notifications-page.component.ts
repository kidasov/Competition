import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from 'app/models/notification';
import { NotificationService } from 'app/services/notification';
import { Observable, Subscription } from 'rxjs';

const MARK_NOTIFICATIONS_AS_READ_TIME = 3000;

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css'],
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  notifications: Notification[] = [];
  sidebarActions = [];
  notificationReadTimeout = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription.add(
      this.notificationService.notifications.subscribe(notifications => {
        this.notifications = notifications;
        const hasUnread = notifications.find(
          notification => notification.read === false,
        );
        if (hasUnread) {
          this.notificationReadTimeout = setTimeout(
            () => this.notificationService.readNotifications(),
            MARK_NOTIFICATIONS_AS_READ_TIME,
          );
        }

        if (!this.notifications) {
          this.sidebarActions = ['remove-notifications'];
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.notificationReadTimeout) {
      clearTimeout(this.notificationReadTimeout);
    }
  }
}
