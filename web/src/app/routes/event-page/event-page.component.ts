import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
})
export class EventPageComponent implements OnInit {
  event: Event;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.params.eventId;
    this.eventService.getEvent(eventId).subscribe((event: Event) => {
      this.event = event;
    });
  }
}
