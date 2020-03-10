import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EventService } from 'app/services/event';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

const DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-search-event-button',
  templateUrl: './search-event-button.component.html',
  styleUrls: ['./search-event-button.component.css'],
})
export class SearchEventButtonComponent implements OnInit {
  subscription: Subscription;
  valueChanged = new Subject<string>();

  searchEventForm = new FormGroup({
    name: new FormControl(),
  });

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.subscription = this.valueChanged.pipe(debounceTime(DEBOUNCE_TIME)).subscribe(() => {
      const name = this.searchEventForm.get('name').value;
      this.eventService.searchEvents(name);
    });
  }

  handleChange(name: string) {
    this.valueChanged.next(name);
  }

  searchEvent() {
    const name = this.searchEventForm.get('name').value;
    console.log('name', name);
    this.eventService.searchEvents(name);
  }
}
