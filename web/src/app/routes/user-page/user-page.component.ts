import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'app/services/user';
import { ActivatedRoute } from '@angular/router';
import { User } from 'app/models/user';
import { AuthProvider } from 'app/services/auth/provider';
import { Subscription } from 'rxjs';
import { Id } from 'app/types/types';
import { FormGroup, FormControl } from '@angular/forms';

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

  editForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    ttwId: new FormControl(),
  });

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
  ) {}

  fetchUser() {
    const userId = this.route.snapshot.params.userId;
    this.userService.getUser(userId).subscribe(user => {
      this.user = new User(user);
    });
  }

  ngOnInit() {
    this.subscription = this.authProvider.userInfo.subscribe(userInfo => {
      this.currentUserId = userInfo.userId;
      this.fetchUser();
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
        ttwId: this.editForm.get('ttwId').value,
      })
      .subscribe(() => {
        this.fetchUser();
        this.showEdit = false;
      });
  }

  showEditPopup() {
    this.showEdit = true;
  }

  closeEditPopup() {
    this.showEdit = false;
  }
}