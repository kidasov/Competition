import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'app/services/user';
import { User } from 'app/models/user';

@Component({
  selector: 'add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
})
export class AddUserFormComponent implements OnInit {
  @Output()
  onClose = new EventEmitter();
  @Output()
  onFetchUsers = new EventEmitter();

  userForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
  });

  constructor(private userService: UserService) {}

  addUser(event: Event) {
    this.userService
      .addUser({
        firstName: this.userForm.get('firstName').value,
        lastName: this.userForm.get('lastName').value,
        email: this.userForm.get('email').value,
      })
      .subscribe((event: any) => {
        this.onClose.emit();
        this.onFetchUsers.emit();
      });
  }

  close(event: Event) {
    event.preventDefault();
    this.onClose.emit();
  }

  ngOnInit() {}
}
