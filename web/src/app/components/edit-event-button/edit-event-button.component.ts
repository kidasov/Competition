import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { API_URL } from 'app/consts/common';
import { DetailedEvent } from 'app/models/event';
import { EventService } from 'app/services/event';
import { StorageService, UploadEventType } from 'app/services/storage';
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
  coverMediaId: number;
  previewCoverImage: string = null;
  uploading = false;
  uploadProgress = 0;

  controls = {
    name: new FormControl(),
    description: new FormControl(),
  };

  editForm = new FormGroup(this.controls);

  constructor(private eventService: EventService, private storageService: StorageService) {}

  ngOnInit() {
    $('.modal').appendTo('body');
    $('.modal').on('shown.bs.modal', function() {
      $('#event-name').focus();
    });
    this.subscription.add(
      this.eventService.currentEvent.subscribe(event => { this.currentEvent = event;
      this.coverMediaId = event.coverMediaId;
    })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    this.eventService.patchEvent(this.currentEvent.id, data).subscribe(() => {
      $('#editEventModal').modal('hide');
    });
  }

  handleFileButtonClick() {
    $('#file-input').click();
    return false;
  }
}
