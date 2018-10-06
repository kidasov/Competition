import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Output()
  onLoginClick = new EventEmitter();

  constructor() {}

  handleClick() {
    this.onLoginClick.emit();
  }

  ngOnInit() {}
}
