import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-notifications-item',
  templateUrl: './notifications-item.component.html',
  styleUrls: ['./notifications-item.component.css']
})
export class NotificationsItemComponent implements OnInit {
  @Input()
  notification: Notification;
  @Input()
  leftButtonName?: string;
  @Input()
  rightButtonName?: string;
  @Input()
  message: string;
  @Output()
  onLeftButtonClick = new EventEmitter();
  @Output()
  onRightButtonClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  handleLeftButtonClick(event: Event) {
    this.onLeftButtonClick.emit(this.notification);
  }

  handleRightButtonClick() {
    this.onRightButtonClick.emit(this.notification);
  }
}
