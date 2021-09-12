import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import $ from 'jquery';

@Component({
  selector: 'app-recover-password-form',
  templateUrl: './recover-password-form.component.html',
  styleUrls: ['./recover-password-form.component.css']
})
export class RecoverPasswordFormComponent implements OnInit {
  @Output()
  close = new EventEmitter();

  constructor() { }

  recoverPasswordForm = new FormGroup({
    email: new FormControl(),
  })

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('hidden.bs.modal', () => {
      this.recoverPasswordForm.reset();
    });
  }

  handleClose(event: Event) {
    this.close.emit();
    event.preventDefault();
  }

  recoverPassword(event: Event) {
    event.preventDefault();
  }

}
