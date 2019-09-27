import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Attendee } from 'app/models/attendee';
import { DetailedEvent } from 'app/models/event';
import { User } from 'app/models/user';
import { AuthProvider } from 'app/services/auth/provider';
import { EventService } from 'app/services/event';
import { UserService } from 'app/services/user';
import { Id } from 'app/types/types';
import $ from 'jquery';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-invite-user-button',
  templateUrl: './invite-user-button.component.html',
  styleUrls: ['./invite-user-button.component.css'],
})
export class InviteUserButtonComponent implements OnInit, OnDestroy {
  @Input()
  event: DetailedEvent;
  subscription = new Subscription();
  users: User[];
  requesters: Attendee[];
  inviteForm = new FormGroup({
    invitedUser: new FormControl()
  });

  constructor(
    private authProvider: AuthProvider,
    private userService: UserService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('.ng-input > input').focus();
    });
    this.subscription.add(
      combineLatest(this.authProvider.userInfo, this.userService.users)
        .pipe(
          map(([userInfo, users]) =>
            users.filter(user => user.id !== userInfo.userId),
          ),
        )
        .subscribe(users => (this.users = users)),
    );

    this.subscription.add(
      this.authProvider.userInfo.subscribe(userInfo => {
        this.requesters = this.event.attendees.filter(
          attendee => attendee.pairedUserId === userInfo.userId,
        );
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  pairWithUser(targetUserId: Id) {
    this.eventService.pairWithUser(this.event.id, targetUserId);
    $('.modal').modal('hide');
    return false;
  }

  inviteUser() {
    const userId = this.inviteForm.get('invitedUser').value;
    this.pairWithUser(userId);
  }
}
