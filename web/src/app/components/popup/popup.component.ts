import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  width = '400';
  @Output()
  close = new EventEmitter();

  constructor() {}

  handleClose(event: Event) {
    event.preventDefault();
    this.close.emit();
  }

  get containerStyle() {
    return {
      width: `${this.width}px`,
    };
  }

  ngOnInit() {}
}
