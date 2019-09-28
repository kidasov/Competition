import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from 'app/models/notification';
import { NotificationService } from 'app/services/notification';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.css']
})
export class NotificationsPageComponent implements OnInit, OnDestroy {
  sidebarActions: string[] = [];
  subscribtion = new Subscription();
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.subscribtion.add(this.notificationService.fetchNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.notifications.forEach(notification => console.log(notification.sentByUser.name))
    }));
  }

  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }

}
