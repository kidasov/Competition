import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { AuthProvider } from '../../services/auth/provider';
import { Observable, Subscription } from 'rxjs';

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

  constructor(private authProvider: AuthProvider) {}

  handleLogin() {
    this.onLoginClick.emit();
  }

  handleLogout() {
    this.authProvider.invalidateSessionKey();
  }

  ngOnInit() {
    this.subscription = this.authProvider.authorized.subscribe(authorized => {
      this.authorized = authorized;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
