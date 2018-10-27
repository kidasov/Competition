import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'app/services/user';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css'],
})
export class AddUserFormComponent implements OnInit {
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

  addUser(event: Event) {
    this.userService
      .addUser({
        firstName: this.userForm.get('firstName').value,
        lastName: this.userForm.get('lastName').value,
        email: this.userForm.get('email').value,
        ttwId: '',
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
