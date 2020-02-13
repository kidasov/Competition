import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
export class EditUserButtonComponent implements OnInit, OnDestroy {
  faTrashAlt = faTrashAlt;
  subscription: Subscription = new Subscription();
  currentUser: User;
  routeUserId: string;

  editForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required])
  });

  constructor(private userService: UserService, private authProvider: AuthProvider, private route: ActivatedRoute) { }

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('#first-name').focus();
    });
    this.subscription.add(this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      const { firstName, lastName, email } = this.currentUser;
      this.editForm.controls.firstName.setValue(firstName);
      this.editForm.controls.lastName.setValue(lastName);
      this.editForm.controls.email.setValue(email);
    }));
    this.subscription.add(this.route.params.subscribe(params => this.routeUserId = params.userId));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get firstName() {
    return this.editForm.controls.firstName;
  }

  get lastName() {
    return this.editForm.controls.lastName;
  }

  get email() {
    return this.editForm.controls.email;
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
