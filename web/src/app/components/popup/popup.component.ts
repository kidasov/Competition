import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  @Input()
  title: String;
  @Output()
  close = new EventEmitter();

  constructor() {}

  handleClose(event: Event) {
    event.preventDefault();
    this.close.emit();
  }

  ngOnInit() {}
}
