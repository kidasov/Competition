import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth/service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @Output()
  onClose = new EventEmitter();

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
    this.onClose.emit();
    event.preventDefault();
  }

  signIn(event: Event) {
    event.preventDefault();
    this.authService
      .signIn({
        email: this.signInForm.get('email').value,
        password: this.signInForm.get('password').value,
      })
      .subscribe(() => this.onClose.emit());
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
      .subscribe(() => this.onClose.emit());
  }

  ngOnInit() {}
}
