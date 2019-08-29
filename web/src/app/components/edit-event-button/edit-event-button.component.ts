import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DetailedEvent } from 'app/models/event';
import { EventService } from 'app/services/event';
import $ from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-event-button',
  templateUrl: './edit-event-button.component.html',
  styleUrls: ['./edit-event-button.component.css'],
})
export class EditEventButtonComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  currentEvent: DetailedEvent;
  controls = {
    name: new FormControl(),
    description: new FormControl(),
  };

  editForm = new FormGroup(this.controls);

  constructor(private eventService: EventService) {}

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('#event-name').focus();
    });
    this.subscription.add(
      this.eventService.currentEvent.subscribe(event => { this.currentEvent = event; })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  saveEvent() {
    const name = this.controls.name.value;
    const description = this.controls.description.value;
    const data = {};
    if (name !== null) {
      data['name'] = name;
    }
    if (description !== null) {
      data['description'] = description;
    }
    this.eventService.patchEvent(this.currentEvent.id, data).subscribe(() => {
      $('#editEventModal').modal('hide');
    });
  }
}
