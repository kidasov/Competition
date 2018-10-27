import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'app/services/user';

@Component({
  selector: 'app-edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css'],
})
export class EditUserFormComponent implements OnInit {
  @Input()
  users = [];
  @Input()
  editedUser;
  @Output()
  close = new EventEmitter();
  @Output()
  fetchUsers = new EventEmitter();

  userForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
  });

  constructor(private userService: UserService) {}

  editUser(event: Event) {
    const { id, firstName, lastName, email } = this.editedUser;
    this.userService
      .patchUser(id, {
        firstName: this.userForm.get('firstName').value || firstName,
        lastName: this.userForm.get('lastName').value || lastName,
        email: this.userForm.get('email').value || email,
      })
      .subscribe(() => {
        this.close.emit();
        this.fetchUsers.emit();
      });
  }

  doClose(event: Event) {
    event.preventDefault();
    this.close.emit();
  }

  ngOnInit() {}
}
