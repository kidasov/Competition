import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css'],
})
export class IconButtonComponent implements OnInit {
  @Input()
  image: String;
  @Output()
  onClick = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  handleClick(event: Event) {
    event.preventDefault();
    this.onClick.emit();
  }
}
