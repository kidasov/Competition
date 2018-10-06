import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  @Output()
  onClose = new EventEmitter();

  signInForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  registerForm = new FormGroup({
    firstName: new FormControl(),
    secondName: new FormControl(),
  });

  handleClose() {
    this.onClose.emit();
  }

  ngOnInit() {}
}
