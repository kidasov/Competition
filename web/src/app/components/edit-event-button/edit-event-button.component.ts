import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from 'app/consts/common';
import { DetailedEvent } from 'app/models/event';
import { EventService } from 'app/services/event';
import { StorageService, UploadEventType } from 'app/services/storage';
import $ from 'jquery';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-event-button',
  templateUrl: './edit-event-button.component.html',
  styleUrls: ['./edit-event-button.component.css'],
})
export class EditEventButtonComponent implements OnInit, OnDestroy {
  faTrashAlt = faTrashAlt;
  subscription = new Subscription();
  currentEvent: DetailedEvent;
  coverMediaId: number;
  previewCoverImage: string = null;
  uploading = false;
  uploadProgress = 0;

  controls = {
    name: new FormControl(),
    description: new FormControl(),
    pair: new FormControl(),
    publish: new FormControl(),
    startsAtDate: new FormControl(),
    startsAtTime: new FormControl(),
    endsAtDate: new FormControl(),
    endsAtTime: new FormControl(),
  };

  editForm = new FormGroup(this.controls);

  constructor(
    private eventService: EventService,
    private storageService: StorageService,
    private router: Router,
  ) {}

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('#event-name').focus();
    });
    this.subscription.add(
      this.eventService.currentEvent.subscribe(event => {
        this.currentEvent = event;
        this.coverMediaId = event.coverMediaId;
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get startsAtDate(): string | undefined {
    if (this.currentEvent == null || this.currentEvent.startsAt == null) {
      return;
    }
    return moment(this.currentEvent.startsAt).format('YYYY-MM-DDTHH:mm');
  }

  get endsAtDate(): string | undefined {
    if (this.currentEvent == null || this.currentEvent.endsAt == null) {
      return;
    }
    return moment(this.currentEvent.endsAt).format('YYYY-MM-DDTHH:mm');
  }

  get enteredStartsAt(): Date | undefined {
    return this.parseDate(
      this.controls.startsAtDate.value || this.startsAtDate,
    );
  }

  get enteredEndsAt(): Date | null {
    return this.parseDate(this.controls.endsAtDate.value || this.endsAtDate);
  }

  private parseDate(date: string | null): Date | null {
    if (date == null) {
      return null;
    }
    const parsed = moment(`${date}`).toDate();
    return !Number.isNaN(parsed.getDate()) ? parsed : null;
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

  get published() {
    return this.currentEvent.state === 'published';
  }

  get paired() {
    return this.currentEvent.type === 'pair';
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

  removeCover() {
    this.coverMediaId = null;
  }

  saveEvent() {
    const name = this.controls.name.value;
    const description = this.controls.description.value;
    const pair = this.controls.pair.value ? 'pair' : 'single';
    const publish = this.controls.publish.value ? 'published' : 'draft';
    const data = {};
    if (name !== null) {
      data['name'] = name;
    }
    if (description !== null) {
      data['description'] = description;
    }
    if (this.coverMediaId !== this.currentEvent.coverMediaId) {
      data['coverMediaId'] = this.coverMediaId;
    }
    if (pair !== this.currentEvent.type) {
      data['type'] = pair;
    }
    if (publish !== this.currentEvent.state) {
      data['state'] = publish;
    }
    data['startsAt'] = this.enteredStartsAt;
    data['endsAt'] = this.enteredEndsAt;
    this.eventService.patchEvent(this.currentEvent.id, data).subscribe(() => {
      $('#editEventModal').modal('hide');
    });
  }

  removeEvent() {
    this.eventService.removeEvent(this.currentEvent).subscribe(() => {
      $('#removeEventModal').modal('hide');
      this.router.navigateByUrl('/events');
    });
  }

  handleFileButtonClick() {
    $('#file-input').click();
    return false;
  }
}
