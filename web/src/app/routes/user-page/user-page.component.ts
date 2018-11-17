import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Event as ModelEvent } from 'app/models/event';
import { User } from 'app/models/user';
import { AuthProvider } from 'app/services/auth/provider';
import { UserService } from 'app/services/user';
import { Id } from 'app/types/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit, OnDestroy {
  user: User;
  subscription: Subscription;
  currentUserId: Id;
  showEdit = false;
  showEditTtw = false;
  events: ModelEvent[] = [];
  authorized: boolean;

  editForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
  });

  editTtwForm = new FormGroup({
    ttwUrl: new FormControl(),
  });

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
  ) {}

  get ttwLink() {
    return `http://r.ttw.ru/players/?id=${this.user.ttwId}`;
  }

  fetchUser() {
    const userId = this.route.snapshot.params.userId;
    this.userService.getUser(userId).subscribe(user => {
      this.user = new User(user);
    });
  }

  fetchEvents() {
    const userId = this.route.snapshot.params.userId;
    this.userService.getEvents(userId).subscribe(events => {
      this.events = events;
    });
  }

  ngOnInit() {
    this.subscription = this.authProvider.userInfo.subscribe(userInfo => {
      this.currentUserId = userInfo.userId;
      this.authorized = userInfo.authorized;
      this.fetchUser();
      this.fetchEvents();
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

  saveUser() {
    this.userService
      .patchUser(this.user.id, {
        firstName: this.editForm.get('firstName').value,
        lastName: this.editForm.get('lastName').value,
        email: this.editForm.get('email').value,
      })
      .subscribe(() => {
        this.fetchUser();
        this.fetchEvents();
        this.showEdit = false;
      });
  }

  showEditPopup() {
    this.showEdit = true;
  }

  closeEditPopup() {
    this.showEdit = false;
  }

  showEditTtwPopup(event: Event) {
    this.showEditTtw = true;
  }

  closeEditTtwPopup() {
    this.showEditTtw = false;
  }

  handleTtwUrl(event: Event) {
    const target = event.target as HTMLInputElement;
    const regex = /http\:\/\/r\.ttw\.ru\/players\/\?id=([0-9a-f]+)/;
    const match = target.value.match(regex);

    if (match != null) {
      target.value = match[1];
      this.editTtwForm.get('ttwUrl').setValue(match[1]);
    }
  }

  saveTtw(event: Event) {
    this.userService
      .patchUser(this.user.id, {
        ttwId: this.editTtwForm.get('ttwUrl').value,
      })
      .subscribe(() => {
        this.fetchUser();
        this.showEditTtw = false;
      });
  }
}
