import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Event as CompetitionEvent } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { EventService } from 'app/services/event';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-page',
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css'],
})
export class EventsPageComponent implements OnInit, OnDestroy {
  events: CompetitionEvent[] = [];
  showAdd: Boolean = false;
  subscription: Subscription;

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchEvents = () => {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  showAddPopup() {
    this.showAdd = true;
  }

  closeAddPopup() {
    this.showAdd = false;
  }
}
