import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input()
  name: string = null;
  @Output()
  onClick = new EventEmitter();

  constructor() {}

  handleClick(event) {
    event.preventDefault();
    this.onClick.emit();
  }

  ngOnInit() {}
}
