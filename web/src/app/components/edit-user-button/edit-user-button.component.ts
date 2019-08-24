import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'app/models/user';
import $ from 'jquery';
import { Subscription } from 'rxjs';
import { AuthProvider } from '../../services/auth/provider';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-edit-user-button',
  templateUrl: './edit-user-button.component.html',
  styleUrls: ['./edit-user-button.component.css']
})
export class EditUserButtonComponent implements OnInit {
  subscription: Subscription = new Subscription();
  currentUser: User;
  
  editForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl()
  });

  constructor(private userService: UserService, private authProvider: AuthProvider) { }

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('#first-name').focus();
    });
    this.subscription = this.userService.currentUser.subscribe(user => this.currentUser = user);
  }

  saveUser() {
    const firstName = this.editForm.get('firstName').value;
    const lastName = this.editForm.get('lastName').value;
    const email = this.editForm.get('email').value;
    const data = {};
    if (firstName !== null) {
      data['firstName'] = firstName;
    }
    if (lastName !== null) {
      data['lastName'] = lastName;
    }
    if (email !== null) {
      data['email'] = email;
    }
    this.userService
      .patchUser(this.currentUser.id, data).subscribe(() => {
        $('#editProfileModal').modal('hide');
      });
  }
}
