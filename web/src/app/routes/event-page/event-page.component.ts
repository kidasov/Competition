import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { API_URL } from 'app/consts/common';
import { Attendee, DetailedEvent } from 'app/models/event';
import { AuthProvider } from 'app/services/auth/provider';
import { EventService } from 'app/services/event';
import { StorageService, UploadEventType } from 'app/services/storage';
import { Id } from 'app/types/types';
import * as moment from 'moment';
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
  previewCoverImage: string = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authProvider: AuthProvider,
    private router: Router,
    private storageService: StorageService,
  ) {}

  controls = {
    name: new FormControl(),
    publish: new FormControl(),
    startsAtDate: new FormControl(),
    startsAtTime: new FormControl(),
    endsAtDate: new FormControl(),
    endsAtTime: new FormControl(),
    description: new FormControl(),
  };

  editForm = new FormGroup(this.controls);

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

  get name() {
    return this.event.name;
  }

  get location() {
    return this.event.location;
  }

  get date() {
    return moment(this.event.startsAt)
      .lang('ru')
      .format('D MMMM YYYY, HH:mm');
  }

  get attendees() {
    return this.event.attendees.length;
  }

  get description() {
    return this.event.description;
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
        name: this.controls.name.value,
        state: this.controls.publish.value ? 'published' : 'draft',
        coverMediaId: this.coverMediaId,
        startsAt: this.enteredStartsAt,
        endsAt: this.enteredEndsAt,
        description: this.controls.description.value,
      })
      .subscribe(() => {
        this.fetchEvent();
        this.showEdit = false;
      });
  }

  showEditPopup() {
    this.showEdit = true;
    this.coverMediaId = this.event.coverMediaId;
  }

  closeEditPopup() {
    this.showEdit = false;
  }

  upload(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files.length) {
      return;
    }
    const file = files[0];

    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      this.previewCoverImage = reader.result as string;
    });
    reader.readAsDataURL(file);

    this.uploading = true;
    this.uploadProgress = 0;

    return this.storageService.uploadFile(file).subscribe(uploadEvent => {
      switch (uploadEvent.type) {
        case UploadEventType.Progress:
          this.uploadProgress = uploadEvent.progress;
          break;
        case UploadEventType.Complete:
          this.uploading = false;
          this.coverMediaId = uploadEvent.medias[0].id;
          break;
      }
    });
  }

  get editCoverPreviewStyle() {
    const url = this.uploading
      ? this.previewCoverImage
      : `${API_URL}/storage/${this.coverMediaId}`;
    return {
      backgroundImage: `url('${url}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  removeCover() {
    this.coverMediaId = null;
  }

  get startsAtDate(): string | undefined {
    if (this.event == null || this.event.startsAt == null) {
      return;
    }
    return moment(this.event.startsAt).format('YYYY-MM-DD');
  }

  get startsAtTime(): string {
    if (this.event == null || this.event.startsAt == null) {
      return '00:00';
    }
    return moment(this.event.startsAt).format('HH:mm');
  }

  get enteredStartsAt(): Date | undefined {
    return this.parseDate(
      this.controls.startsAtDate.value || this.startsAtDate,
      this.controls.startsAtTime.value || this.startsAtTime,
    );
  }

  get endsAtDate(): string | undefined {
    if (this.event == null || this.event.endsAt == null) {
      return;
    }
    return moment(this.event.endsAt).format('YYYY-MM-DD');
  }

  get endsAtTime(): string {
    if (this.event == null || this.event.endsAt == null) {
      return '00:00';
    }
    return moment(this.event.endsAt).format('HH:mm');
  }

  get enteredEndsAt(): Date | null {
    return this.parseDate(
      this.controls.endsAtDate.value || this.endsAtDate,
      this.controls.endsAtTime.value || this.endsAtTime,
    );
  }

  private parseDate(date: string | null, time: string | null): Date | null {
    if (date == null || time == null) {
      return null;
    }
    const parsed = moment(`${date} ${time}`).toDate();
    return !Number.isNaN(parsed.getDate()) ? parsed : null;
  }
}
