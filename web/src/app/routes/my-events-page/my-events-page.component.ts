import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Event as CompetitionEvent } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { EventService } from 'app/services/event';
import * as moment from 'moment';
import { combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-my-events-page',
  templateUrl: './my-events-page.component.html',
  styleUrls: ['./my-events-page.component.css'],
})
export class MyEventsPageComponent implements OnInit {
  @Input()
  sidebarActions: string[] = ['add'];
  events: CompetitionEvent[] = [];
  showAdd = false;
  showLogin = false;
  subscription = new Subscription();

  createForm = new FormGroup({
    name: new FormControl(),
  });

  constructor(
    private eventService: EventService,
    private router: Router,
    private authProvider: AuthProvider,
  ) {}

  addEvent(e: Event) {
    e.preventDefault();
    const name = this.createForm.get('name').value;
    this.eventService.createEvent(name).subscribe(event => {
      this.showAdd = false;
      this.router.navigateByUrl(`/events/${event.id}`);
    });
  }

  removeEvent(event: CompetitionEvent) {
    this.eventService.removeEvent(event).subscribe(() => {
      this.events = this.events.filter(e => e.id !== event.id);
    });
  }

  formatDate(date: string) {
    return moment(date).format('MMM d, YYYY, HH:mm');
  }

  ngOnInit() {
    this.subscription = this.authProvider.userInfo.subscribe(this.fetchEvents);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchEvents = () => {
    this.subscription.add(combineLatest(this.authProvider.userInfo, this.eventService.events).pipe(map(([userInfo, events]) => {
      return events.filter(event => event.ownerUserId === userInfo.userId);
    })).subscribe(events => {
      this.events = events;
      console.log('ev', this.events)
    }));
  }

  showAddPopup() {
    this.showAdd = true;
  }

  closeAddPopup() {
    this.showAdd = false;
  }

  showLoginPopup() {
    this.showLogin = true;
  }

  closeLoginPopup() {
    this.showLogin = false;
  }
}
