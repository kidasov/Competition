import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AuthProvider } from '../../services/auth/provider';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'app/services/user';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output()
  onLoginClick = new EventEmitter();
  authorized: boolean;
  subscription: Subscription;
  userId: number;

  constructor(private authProvider: AuthProvider) {}

  handleLogin() {
    this.onLoginClick.emit();
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
