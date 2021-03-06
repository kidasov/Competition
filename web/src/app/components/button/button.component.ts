import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input()
  value: string = null;
  @Input()
  appearance = 'fancy';
  @Input()
  icon: string = null;
  @Output()
  press = new EventEmitter();

  constructor() {}

  handleClick(event) {
    event.preventDefault();
    this.press.emit();
  }

  ngOnInit() {}
}
