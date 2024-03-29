import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AUTH_URL } from 'app/consts/auth';
import { AuthService } from 'app/services/auth/service';
import $ from 'jquery';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @Output()
  close = new EventEmitter();
  signInErrorMessage = "";
  registerFormErrorMessage = "";
  showRecoverPassword = false;

  constructor(private authService: AuthService) {}

  signInForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  registerForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });

  handleClose(event: Event) {
    this.close.emit();
    event.preventDefault();
  }

  handleVkLogin() {
    window.location.href = AUTH_URL;
  }

  closeLogin() {
    $('.modal').modal('hide');
    this.close.emit();
  }

  signIn(event: Event) {
    event.preventDefault();
    this.signInErrorMessage = "";
    this.authService
      .signIn({
        email: this.signInForm.get('email').value,
        password: this.signInForm.get('password').value,
      })
      .subscribe(() => this.closeLogin(), error => {
        this.signInErrorMessage = error.message;
      });
  }

  signUp(event: Event) {
    event.preventDefault();
    this.authService
      .signUp({
        firstName: this.registerForm.get('firstName').value,
        lastName: this.registerForm.get('lastName').value,
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
      })
      .subscribe(() => this.closeLogin(), error => this.registerFormErrorMessage = error.message);
  }

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('hidden.bs.modal', () => {
      this.signInErrorMessage = "";
      this.registerFormErrorMessage = "";
      this.signInForm.reset();
      this.registerForm.reset();
    });
  }

  showRecoveryPasswordPopup() {
    console.log('show popup');
    this.showRecoverPassword = true;
    $('#loginEventModal').modal('hide');
  }

  closeRecoverPasswordPopup() {
    this.showRecoverPassword = false;
  }
}
