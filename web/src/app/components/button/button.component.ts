import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input()
  name: string = null;
  @Output()
  click = new EventEmitter();

  constructor() {}

  handleClick(event) {
    event.preventDefault();
    this.click.emit();
  }

  ngOnInit() {}
}
