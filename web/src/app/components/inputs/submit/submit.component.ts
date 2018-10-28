import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SubmitComponent),
      multi: true,
    },
  ],
})
export class SubmitComponent implements OnInit {
  @Input()
  value: string;
  @Input()
  enabled = true;

  constructor() {}

  ngOnInit() {}

  get classes() {
    return this.enabled ? '' : 'disabled';
  }
}
