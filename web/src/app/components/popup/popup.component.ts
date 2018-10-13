import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  @Input()
  title: String;
  @Output()
  onClose = new EventEmitter();

  constructor() {}

  handleClose(event: Event) {
    event.preventDefault();
    this.onClose.emit();
  }

  ngOnInit() {}
}
