import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthProvider } from 'app/services/auth/provider';
import { NotificationService } from 'app/services/notification';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input()
  title: string;
  @Input()
  current: string;
  @Input()
  actions: string[];
  @Output()
  showAddEventClick = new EventEmitter();
  authorized: boolean;
  subscription: Subscription;
  userId: number;
  isEventsPage = false;
  isProfilePage = false;
  isNotificationsPage = false;
  showLogin = false;
  unread: number;

  constructor(private authProvider: AuthProvider, private notificationService: NotificationService) {}

  handleLogout(event: Event) {
    this.authProvider.invalidateSessionKey();
    event.preventDefault();
  }

  showAddEventPopup() {
    this.showAddEventClick.emit();
  }

  ngOnInit() {
    this.subscription = this.authProvider.userInfo.subscribe(userInfo => {
      this.authorized = userInfo.authorized;
      this.userId = userInfo.userId;
    });
    this.isEventsPage = this.current === 'events';
    this.isProfilePage = this.current === 'profile';
    this.isNotificationsPage = this.current === 'notifications';
    this.subscription.add(this.notificationService.unread.subscribe(unread => this.unread = unread));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showLoginPopup() {
    this.showLogin = true;
  }

  closeLoginPopup() {
    this.showLogin = false;
  }

  hasEdit() {

  }
}
