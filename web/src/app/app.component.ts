import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';

  showLogin = false;

  public showLoginPopup() {
    this.showLogin = true;
  }

  public closeLoginPopup() {
    this.showLogin = false;
  }
}
