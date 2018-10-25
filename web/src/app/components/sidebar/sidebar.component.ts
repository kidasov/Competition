import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthProvider } from '../../services/auth/provider';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output()
  loginClick = new EventEmitter();
  authorized: boolean;
  subscription: Subscription;
  userId: number;

  constructor(private authProvider: AuthProvider) {}

  handleLogin() {
    this.loginClick.emit();
  }

  ngOnInit() {
    this.subscription = this.authProvider.userInfo.subscribe(userInfo => {
      this.authorized = userInfo.authorized;
      this.userId = userInfo.userId;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
