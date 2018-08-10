import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user';
import { Router } from '@angular/router';

@Component({
  selector: 'user-create-page',
  templateUrl: './user-create-page.component.html',
  styleUrls: ['./user-create-page.component.css'],
})
export class UserCreatePage implements OnInit {
  userForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
  });

  constructor(private router: Router, private userService: UserService) {}

  addUser(event: Event) {
    event.preventDefault();

    this.userService
      .addUser({
        firstName: this.userForm.get('firstName').value,
        lastName: this.userForm.get('lastName').value,
        email: this.userForm.get('email').value,
      })
      .subscribe(event => {
        this.router.navigateByUrl('/users');
      });
  }

  ngOnInit() {}
}
