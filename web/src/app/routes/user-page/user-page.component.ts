import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'app/services/user';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/models/user';
import { AuthProvider } from 'app/services/auth/provider';
import { Subscription } from 'rxjs';
import { Id } from 'app/types/types';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  user: User;
  subscription: Subscription;
  currentUserId: Id;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.params.userId;
    this.subscription = this.authProvider.userInfo.subscribe(userInfo => {
      this.currentUserId = userInfo.userId;
    });
    this.userService.getUser(userId).subscribe(user => {
      this.user = new User(user);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get currentUser() {
    const userId = +this.route.snapshot.params.userId;
    return this.currentUserId === userId;
  }

  handleLogout() {
    this.authProvider.invalidateSessionKey();
  }
}
