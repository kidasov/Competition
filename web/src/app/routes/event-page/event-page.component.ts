import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Attendee, DetailedEvent } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { EventService } from 'app/services/event';
import { StorageService, UploadEventType } from 'app/services/storage';
import { Id } from 'app/types/types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css'],
})
export class EventPageComponent implements OnInit, OnDestroy {
  event: DetailedEvent;
  authorized: boolean;
  subscription: Subscription;
  showEdit = false;
  uploading = false;
  uploadProgress = 0;
  coverMediaId: number;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
    private router: Router,
    private storageService: StorageService,
  ) {}

  editForm = new FormGroup({
    name: new FormControl(),
    publish: new FormControl(),
  });

  get participants(): Attendee[] {
    return this.event.attendees.filter(
      attendee => attendee.status === 'approved',
    );
  }

  get pretenders(): Attendee[] {
    return this.event.attendees.filter(
      attendee => attendee.status === 'join_request',
    );
  }

  get invited(): Attendee[] {
    return this.event.attendees.filter(
      attendee => attendee.status === 'invited',
    );
  }

  get eventOwner(): Boolean {
    return this.authProvider.userId === this.event.ownerUserId;
  }

  get published() {
    return this.event.state === 'published';
  }

  get canRegister() {
    return (
      this.authorized &&
      !this.event.attendees.find(
        pretender => pretender.userId === this.authProvider.userId,
      )
    );
  }

  ngOnInit() {
    this.fetchEvent();
    this.subscription = this.authProvider.userInfo.subscribe(userInfo => {
      this.authorized = userInfo.authorized;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  fetchEvent = () => {
    const eventId = this.route.snapshot.params.eventId;
    this.eventService.getEvent(eventId).subscribe(event => {
      this.event = event;
    });
  };

  register() {
    const eventId = this.route.snapshot.params.eventId;
    this.eventService
      .register(eventId, { role: 'participant' })
      .subscribe(this.fetchEvent);
  }

  accept(userId: Id) {
    this.eventService
      .accept(this.event.id, userId, {})
      .subscribe(this.fetchEvent);
  }

  removeUser(userId: Id) {
    this.eventService
      .removeUser(this.event.id, userId)
      .subscribe(this.fetchEvent);
  }

  goBack() {
    this.router.navigateByUrl('/events');
  }

  saveEvent() {
    this.eventService
      .patchEvent(this.event.id, {
        name: this.editForm.get('name').value,
        state: this.editForm.get('publish').value ? 'published' : 'draft',
        coverMediaId: this.coverMediaId,
      })
      .subscribe(() => {
        this.fetchEvent();
        this.showEdit = false;
      });
  }

  showEditPopup() {
    this.showEdit = true;
  }

  closeEditPopup() {
    this.showEdit = false;
  }

  upload(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    if (!files.length) {
      return;
    }

    this.uploading = true;
    this.uploadProgress = 0;

    return this.storageService.uploadFile(files[0]).subscribe(uploadEvent => {
      switch (uploadEvent.type) {
        case UploadEventType.Progress:
          this.uploadProgress = uploadEvent.progress;
          break;
        case UploadEventType.Complete:
          this.uploading = false;
          this.coverMediaId = uploadEvent.uploadId;
          break;
      }
    });
  }
}
