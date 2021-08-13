import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Event as CompetitionEvent, EventProgressState } from 'app/models/event';
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
  @Input()
  sidebarActions: string[] = ['add', 'search'];
  currentEvents: CompetitionEvent[] = [];
  showAdd = false;
  showLogin = false;
  subscription = new Subscription();

  createForm = new FormGroup({
    name: new FormControl(),
  });

  constructor(
    private eventService: EventService,
    private authProvider: AuthProvider,
  ) {}

  formatDate(date: string) {
    return moment(date).format('MMM d, YYYY, HH:mm');
  }

  ngOnInit() {
    this.subscription = this.authProvider.userInfo.subscribe(() => this.eventService.fetchEvents());
    this.subscription.add(this.eventService.events.subscribe(events => {
      const now = moment();
      this.currentEvents = events.sort((first, second) => {
        if (first.progressState === EventProgressState.Ongoing && (second.progressState === EventProgressState.Finished || second.progressState === EventProgressState.Upcoming)) {
          return -1;
        }

        if ((first.progressState === EventProgressState.Finished || first.progressState === EventProgressState.Upcoming) && second.progressState === EventProgressState.Ongoing) {
          return 1;
        }

        if (first.progressState === EventProgressState.Upcoming && second.progressState === EventProgressState.Finished) {
          return -1;
        }

        if (first.progressState === EventProgressState.Finished && second.progressState === EventProgressState.Upcoming) {
          return 1;
        }

        return 0;
      }); 
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
