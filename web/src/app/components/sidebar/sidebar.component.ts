import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AuthProvider } from 'app/services/auth/provider';
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
  showLogin = false;

  constructor(private authProvider: AuthProvider ) {}

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
