import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'app/services/event';
import $ from 'jquery';

@Component({
  selector: 'app-add-event-button',
  templateUrl: './add-event-button.component.html',
  styleUrls: ['./add-event-button.component.css'],
})
export class AddEventButtonComponent implements OnInit, OnDestroy {
  createForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('#event-name').focus();
    });
  }

  ngOnDestroy() {
    $('.modal').off('shown.bs.modal');
  }

  addEvent(e: Event) {
    e.preventDefault();
    const name = this.createForm.get('name').value;
    this.eventService.createEvent(name).subscribe(event => {
      this.router.navigateByUrl(`/events/${event.id}?mode=edit`);
      $('#addEventModal').modal('hide');
    });
  }

  get name() {
    return this.createForm.controls.name;
  }
}
