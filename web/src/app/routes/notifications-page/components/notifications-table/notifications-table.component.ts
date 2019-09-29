import { Component, Input, OnInit } from '@angular/core';
import { Notification, NotificationType } from 'app/models/notification';
import { EventService } from 'app/services/event';
import { NotificationService } from 'app/services/notification';

@Component({
  selector: 'app-notifications-table',
  templateUrl: './notifications-table.component.html',
  styleUrls: ['./notifications-table.component.css'],
})
export class NotificationsTableComponent implements OnInit {
  @Input()
  notifications: Notification[];

  constructor(
    private notificationService: NotificationService,
    private eventService: EventService,
  ) {}

  ngOnInit() {}

  public dismissInviteNotification(notification) {
    this.notificationService.removeNotification(notification).subscribe();
    this.notificationService
      .createNotification(
        NotificationType.RejectInvitation,
        notification.sentBy,
        notification.eventId,
      )
      .subscribe();
  }

  public hideNotification(notification) {
    this.notificationService.removeNotification(notification).subscribe();
  }

  pairWithUser(notification: Notification) {
    const eventId = notification.eventId;
    this.eventService
      .register(eventId, { role: 'participant' })
      .subscribe(() => {
        this.eventService.fetchEvent(eventId);
        this.eventService.pairWithUser(
          notification.eventId,
          notification.sentBy,
        );
      });
    this.notificationService.removeNotification(notification).subscribe();
    return false;
  }
}
