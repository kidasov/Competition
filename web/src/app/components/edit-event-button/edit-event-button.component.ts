import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from 'app/consts/common';
import { DetailedEvent, EventType, PublishState } from 'app/models/event';
import { EventService } from 'app/services/event';
import { StorageService, UploadEventType } from 'app/services/storage';
import $ from 'jquery';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

const DATE_NOT_SET = 'Не установлена';
const DATE_FORMAT = 'DD/MM/YYYY, HH:mm';
@Component({
  selector: 'app-edit-event-button',
  templateUrl: './edit-event-button.component.html',
  styleUrls: ['./edit-event-button.component.css'],
})
export class EditEventButtonComponent implements OnInit, OnDestroy {
  DatePickerDirective;
  faTrashAlt = faTrashAlt;
  subscription = new Subscription();
  currentEvent: DetailedEvent;
  coverMediaId: number;
  previewCoverImage: string = null;
  uploading = false;
  showEndsRegAt = false;
  uploadProgress = 0;
  errorMessage = '';

  controls = {
    name: new FormControl('', [
      Validators.required,
    ]),
    description: new FormControl(),
    pair: new FormControl(),
    publish: new FormControl(true),
    startsAtDate: new FormControl(),
    endsAtDate: new FormControl('', [
      (control) => {
        if (!this.controls) { return null; }
        const isValid = moment(control.value, DATE_FORMAT).diff(moment(this.controls.startsAtDate.value, DATE_FORMAT)) > 0;

        return isValid ?  null : {'error': { value: control.value }};
      }
    ]),
    endsRegAtDate: new FormControl('', [
      control => {
        if (!this.controls) { return null; }

        const isValid = control.value && moment(this.controls.startsAtDate.value, DATE_FORMAT).diff(moment(control.value, DATE_FORMAT)) > 0;

        return isValid ?  null : {'error': { value: control.value }};
      }
    ]),
  };

  editForm = new FormGroup(this.controls);

  config = {
    opens: 'left',
    format: DATE_FORMAT,
    locale: 'ru',
    showTwentyFourHours: true,
  };

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
        this.showEndsRegAt = !!this.currentEvent.endsRegAt;
        this.controls.name.setValue(this.currentEvent.name);
        this.controls.publish.setValue(this.currentEvent.state === PublishState.Published);
        this.controls.pair.setValue(this.currentEvent.type === EventType.Pair);
        this.controls.endsAtDate.setValue(this.endsAtDate);
        this.controls.startsAtDate.setValue(this.startsAtDate);
        this.controls.endsRegAtDate.setValue(this.endsRegAtDate);
      }),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  endDateValidator = (control) => {
    const isValid = moment(control.value) > moment(this.controls.startsAtDate.value);

    return isValid ?  null : {'Беда': { value: control.value }};
  }

  get name() {
    return this.controls.name;
  }

  get endsAt() {
    return this.controls.endsAtDate;
  }

  get startsAt() {
    return this.controls.startsAtDate;
  }

  get endsRegAt() {
    return this.controls.endsRegAtDate;
  }

  get startsAtDate(): string {
    if (this.currentEvent == null || this.currentEvent.startsAt == null) {
      return DATE_NOT_SET;
    }
    return moment(this.currentEvent.startsAt).format(DATE_FORMAT);
  }

  get endsAtDate(): string {
    if (this.currentEvent == null || this.currentEvent.endsAt == null) {
      return DATE_NOT_SET;
    }
    return moment(this.currentEvent.endsAt).format(DATE_FORMAT);
  }

  get endsRegAtDate(): string {
    if (this.currentEvent == null || this.currentEvent.endsRegAt == null) {
      return DATE_NOT_SET;
    }
    return moment(this.currentEvent.endsRegAt).format(DATE_FORMAT);
  }

  get enteredStartsAt(): Date {
    return this.parseDate(
      this.controls.startsAtDate.value || this.startsAtDate,
    );
  }

  get enteredEndsAt(): Date | null {
    return this.parseDate(this.controls.endsAtDate.value || this.endsAtDate);
  }

  get enteredEndsRegAt() {
    return this.parseDate(this.controls.endsRegAtDate.value || this.endsRegAtDate);
  }

  private parseDate(date: string | null): Date | null {
    if (date == null) {
      return null;
    }
    const parsed = moment(`${date}`, DATE_FORMAT).toDate();
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
    return this.controls.publish;
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
    data['endsRegAt'] = this.enteredEndsRegAt;
    this.eventService.patchEvent(this.currentEvent.id, data).subscribe(() => {
      this.closeEditEventModal();
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

  closeEditEventModal() {
    $('#editEventModal').modal('hide');
  }

  showEditEventModal() {
    $('#editEventModal').modal('show');
    this.errorMessage = '';
  }

  toggleEndsRegSwitch() {
    this.showEndsRegAt = !this.showEndsRegAt;
    this.currentEvent.endsRegAt = null;
  }
}
