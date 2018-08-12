import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'app/services/user';
import { User } from 'app/models/user';

@Component({
  selector: 'edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css'],
})
export class EditUserFormComponent implements OnInit {
  @Input()
  users = [];
  @Input()
  editedUser;
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

  editUser(event: Event) {
    const { id, firstName, lastName, email } = this.editedUser;
    this.userService
      .updateUser(id, {
        firstName: this.userForm.get('firstName').value || firstName,
        lastName: this.userForm.get('lastName').value || lastName,
        email: this.userForm.get('email').value || email,
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
