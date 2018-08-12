import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor } from '@angular/forms';
import { EventService } from '../../services/event';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css'],
})
export class EventCreateComponent implements OnInit {
  eventForm = new FormGroup({
    name: new FormControl(),
    date: new FormControl(),
    location: new FormControl(),
    description: new FormControl(),
  });

  constructor(private router: Router, private eventService: EventService) {}

  addEvent(event: Event) {
    event.preventDefault();

    this.eventService
      .addEvent({
        name: this.eventForm.get('name').value,
        startsAt: this.eventForm.get('date').value,
        location: this.eventForm.get('location').value,
        description: this.eventForm.get('description').value,
        ownerUserId: 1,
      })
      .subscribe(event => {
        this.router.navigateByUrl('/events');
        console.log('In subscribe we are', event);
      });
  }

  ngOnInit() {}
}
