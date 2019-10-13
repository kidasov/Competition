import { Component, OnInit } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormControl } from '@angular/forms';
import { EventService } from 'app/services/event';

@Component({
  selector: 'app-search-event-button',
  templateUrl: './search-event-button.component.html',
  styleUrls: ['./search-event-button.component.css'],
})
export class SearchEventButtonComponent implements OnInit {
  faSearch = faSearch;

  searchEventForm = new FormGroup({
    name: new FormControl(),
  });

  constructor(private eventService: EventService) {}

  ngOnInit() {}

  searchEvent() {
    const name = this.searchEventForm.get('name').value;
    console.log('name', name);
    this.eventService.searchEvents(name);
  }
}
