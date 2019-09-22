import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'app/models/user';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-invite-user-button',
  templateUrl: './invite-user-button.component.html',
  styleUrls: ['./invite-user-button.component.css']
})
export class InviteUserButtonComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  users: User[];
  inviteForm = new FormGroup({
    invitedUser: new FormControl()
  });

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.subscription.add(this.userService.getUsers().subscribe(users => {
      this.users = users;
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
