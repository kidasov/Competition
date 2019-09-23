import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Attendee } from 'app/models/attendee';
import { DetailedEvent, EventType } from 'app/models/event';
import { User } from 'app/models/user';
import { EventService } from 'app/services/event';
import { UserService } from 'app/services/user';
import { Id } from 'app/types/types';
import { Subscription } from 'rxjs';

export interface AttendeeWrapper {
  attendee: Attendee | null;
  pairedId: Id | null;
}

@Component({
  selector: 'app-attendees-table',
  templateUrl: './attendees-table.component.html',
  styleUrls: ['./attendees-table.component.css'],
})
export class AttendeesTableComponent implements OnInit {
  @Input()
  event: DetailedEvent;
  subscription = new Subscription();
  currentUser: User;

  constructor(
    private eventService: EventService,
    private userService: UserService,
  ) {}

  accept(userId: Id) {
    this.eventService.accept(this.event.id, userId, {}).subscribe();
    return false;
  }

  kick(userId: Id) {
    this.eventService.removeUser(this.event.id, userId).subscribe();
    return false;
  }

  ngOnInit() {
    this.subscription.add(
      this.userService.currentUser.subscribe(user => {
        this.currentUser = user;
        console.log('current user id', this.currentUser);
      }),
    );
  }

  get attendeeMap() {
    return this.event.attendees.reduce((res, attendee) => {
      res[attendee.userId] = attendee;
      return res;
    }, {});
  }

  get attendees() {
    const attendeeMap = this.attendeeMap;
    return this.event.attendees.map(attendee => {
      const possibleTeammate = attendeeMap[attendee.pairedUserId];
      const teammate =
        possibleTeammate && possibleTeammate.pairedUserId === attendee.userId
          ? possibleTeammate
          : null;
      const attendeeRating = attendee.rating || 0;
      const teammateRating = (teammate && teammate.rating) || 0;
      const teamRating = attendeeRating + teammateRating;

      return {
        ...attendee,
        id: attendee.userId,
        pairedUserId: attendee.pairedUserId,
        attendeeName: attendee.name,
        teammateName: teammate && teammate.name,
        attendeeRating: attendee.rating,
        teammateRating: teammate && teammate.rating,
        totalRating: teamRating,
      };
    });
  }

  trackById(index, item) {
    return item.id;
  }

  pairWithUser(targetUserId: Id) {
    this.eventService.pairWithUser(this.event.id, targetUserId);
    return false;
  }

  // @Input()
  // attendees: Attendee[] = [];
  // @Input()
  // title: String;
  // @Input()
  // eventOwner: Boolean = false;
  // @Input()
  // eventId: Id;
  // @Input()
  // type: EventType;
  // @Output()
  // add = new EventEmitter();
  // @Output()
  // remove = new EventEmitter();
  // popupUserId: Id;
  // subscription = new Subscription();
  // event: DetailedEvent;
  // currentUserId: Id;

  // constructor(
  //   private authProvider: AuthProvider,
  //   private eventService: EventService,
  //   private router: Router,
  // ) {}

  // ngOnInit() {
  //   this.subscription.add(
  //     this.eventService.getEvent(this.eventId).subscribe(event => {
  //       this.event = event;
  //     }),
  //   );
  //   this.subscription.add(
  //     this.authProvider.userInfo.subscribe(userInfo => {
  //       this.currentUserId = userInfo.userId;
  //     }),
  //   );
  // }

  // get items() {
  //   let counter = 0;
  //   const mappedAttendeeds = this.attendees.map(attendee => {
  //     const pairedUser = this.getUserPair(attendee);
  //     const pairedUserName =
  //       pairedUser &&
  //       `${pairedUser.user.firstName} ${pairedUser.user.lastName}`;
  //     return {
  //       userId: attendee.userId,
  //       displayName: `${attendee.user.firstName} ${attendee.user.lastName}`,
  //       pairedUser,
  //       pairedUserName,
  //       rating: attendee.user.rating,
  //       index: ++counter,
  //       requesters: this.attendees
  //         .filter(a => a.pairedUserId === attendee.userId)
  //         .map(requester => ({
  //           displayName: `${requester.user.firstName} ${
  //             requester.user.lastName
  //           }`,
  //           userId: requester.userId,
  //         })),
  //       actions: [
  //         this.eventOwner && attendee.status === 'join_request'
  //           ? {
  //               label: 'Добавить',
  //               icon: 'baseline-add_circle_outline-24px.svg',
  //               onClick: () => {
  //                 this.add.emit(attendee.userId);
  //               },
  //             }
  //           : null,
  //         this.eventOwner && this.authProvider.userId !== attendee.userId
  //           ? {
  //               label: 'Удалить',
  //               icon: 'baseline-remove_circle_outline-24px.svg',
  //               onClick: () => {
  //                 this.remove.emit(attendee.userId);
  //               },
  //             }
  //           : null,
  //         this.authProvider.userId === attendee.userId
  //           ? {
  //               label: 'Покинуть соревнование',
  //               icon: 'baseline-directions_run-24px.svg',
  //               onClick: () => {
  //                 this.remove.emit(attendee.userId);
  //               },
  //             }
  //           : null,
  //       ].filter(action => action != null),
  //     };
  //   });

  //   const resArray = [];

  //   mappedAttendeeds.forEach(attendee => {
  //     const uniqueId = attendee.userId;

  //     const duplicate = resArray.find(innerAttendee => {
  //       return innerAttendee.pairedUser &&
  //         innerAttendee.pairedUser.userId === uniqueId;
  //     });

  //     if (!duplicate) {
  //       resArray.push(attendee);
  //     }
  //   });
  //   return resArray;
  // }

  // getUserPair(attendee: Attendee) {
  //   const pairedUser = this.attendees.find(
  //     a => a.userId === attendee.pairedUserId,
  //   );
  //   return pairedUser && pairedUser.pairedUserId === attendee.userId
  //     ? pairedUser
  //     : null;
  // }

  // get currentAttendee() {
  //   return this.attendees.find(attendee => attendee.userId === this.currentUserId);
  // }

  // isPaired(index) {
  //   return this.type === 'pair' ? Math.floor(index / 2) + 1 : index + 1;
  // }

  // handleAdd(attendee: Attendee) {
  //   this.add.emit(attendee.userId);
  // }

  // handleRemove(attendee: Attendee) {
  //   this.remove.emit(attendee.userId);
  // }

  // showAdd(attendee: Attendee) {
  //   return this.eventOwner && attendee.status === 'join_request';
  // }

  // showRemove(attendee: Attendee) {
  //   return this.eventOwner && this.authProvider.userId !== attendee.userId;
  // }

  // showLeave(attendee: Attendee) {
  //   return this.authProvider.userId === attendee.userId;
  // }

  // navigateToUserPage(userId: Id) {
  //   this.router.navigate(['users', userId]);
  // }

  // pairWithUser(targetUserId: Id) {
  //   this.eventService.pairWithUser(this.eventId, targetUserId);
  // }

  // openRequestersPopup(event: Event, userId: Id) {
  //   event.preventDefault();
  //   this.popupUserId = userId;
  // }

  // closeRequestersPopup() {
  //   this.popupUserId = null;
  // }
}
