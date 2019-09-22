import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'app/models/user';
import { AuthProvider } from 'app/services/auth/provider';
import $ from 'jquery';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-invite-user-button',
  templateUrl: './invite-user-button.component.html',
  styleUrls: ['./invite-user-button.component.css'],
})
export class InviteUserButtonComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  users: User[];
  inviteForm = new FormGroup({
    invitedUser: new FormControl(),
  });

  constructor(
    private authProvider: AuthProvider,
    private userService: UserService,
  ) {}

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('.ng-input > input').focus();
    });
    this.subscription = combineLatest(
      this.authProvider.userInfo,
      this.userService.users,
    )
      .pipe(
        map(([userInfo, users]) =>
          users.filter(user => user.id !== userInfo.userId),
        ),
      )
      .subscribe(users => (this.users = users));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
