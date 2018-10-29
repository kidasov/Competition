import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements OnInit {
  @Input()
  progress = 0;

  get filledStyle() {
    return { flex: Math.floor(this.progress * 1000) };
  }

  get emptyStyle() {
    return { flex: 1000 - this.filledStyle.flex };
  }

  constructor() {}

  ngOnInit() {}
}
