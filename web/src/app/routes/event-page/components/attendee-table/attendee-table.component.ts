import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Attendee } from 'app/models/attendee';
import { DetailedEvent } from 'app/models/event';
import { User } from 'app/models/user';
import { AuthProvider } from 'app/services/auth/provider';
import { EventService } from 'app/services/event';
import { UserService } from 'app/services/user';
import { Id } from 'app/types/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-attendee-table',
  templateUrl: './attendee-table.component.html',
  styleUrls: ['./attendee-table.component.css'],
})
export class AttendeeTableComponent implements OnInit, OnDestroy {
  @Input()
  attendees: Attendee[] = [];
  @Input()
  event: DetailedEvent;
  subscription = new Subscription();
  currentUser: User;

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private authProvider: AuthProvider,
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.currentUser.subscribe(user => {
        this.currentUser = user;
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  accept(userId: Id) {
    this.eventService.accept(this.event.id, userId, {}).subscribe();
    return false;
  }

  kick(userId: Id) {
    this.eventService.removeUser(this.event.id, userId).subscribe();
    return false;
  }

  get eventOwner(): Boolean {
    return this.authProvider.userId === this.event.ownerUserId;
  }
}
