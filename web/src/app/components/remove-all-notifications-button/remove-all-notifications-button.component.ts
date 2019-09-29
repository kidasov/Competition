import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'app/services/notification';
import $ from 'jquery';

@Component({
  selector: 'app-remove-all-notifications-button',
  templateUrl: './remove-all-notifications-button.component.html',
  styleUrls: ['./remove-all-notifications-button.component.css']
})
export class RemoveAllNotificationsButtonComponent implements OnInit {

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    $('.modal').appendTo('body');
  }

  removeNotifications() {
    this.notificationService.removeNotifications();
    this.closeModal();
  }

  closeModal() {
    $('#removeNotificationsModal').modal('hide');
  }

}
