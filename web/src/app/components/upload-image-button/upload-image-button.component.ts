import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'app/models/user';
import { StorageService, UploadEventType } from 'app/services/storage';
import $ from 'jquery';
import {
  CropperSettings,
  ImageCropperComponent,
} from 'ngx-img-cropper';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user';

const MAX_WIDTH = 766;
const MAX_HEIGHT = 766;

@Component({
  selector: 'app-upload-image-button',
  templateUrl: './upload-image-button.component.html',
  styleUrls: ['./upload-image-button.component.css'],
})
export class UploadImageButtonComponent implements OnInit {
  fileSelected = false;
  @ViewChild('cropper', { static: true })
  cropper: ImageCropperComponent;
  data: any = {};
  uploading = false;
  uploadProgress = 0;
  cropperSettings = new CropperSettings({
    width: 600,
    height: 600,
    canvasWidth: 600,
    canvasHeight: 600,
    noFileInput: true,
    preserveSize: true,
    fileType: 'image/jpeg'
  });
  inputImage = null;
  croppedImage = null;
  subscription: Subscription = new Subscription();
  currentUser: User;

  constructor(
    private storageService: StorageService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.userService.currentUser.subscribe(user => (this.currentUser = user)),
    );
    $('.modal').on('hidden.bs.modal', () => {
      this.inputImage = null;
      this.fileSelected = false;
    });
  }

  fileChangeListener($event) {
    const image = new Image();

    image.onload = () => {
      const ratio = image.width / image.height;
      if (ratio > 1) {
        this.cropperSettings.canvasWidth = MAX_WIDTH;
        this.cropperSettings.canvasHeight = MAX_WIDTH / ratio;
      } else {
        this.cropperSettings.canvasHeight = MAX_HEIGHT;
        this.cropperSettings.canvasWidth = MAX_HEIGHT * ratio;
      }

      this.fileSelected = true;
    };

    const file = $event.target.files[0];
    const myReader = new FileReader();

    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      this.inputImage = image;
    };

    myReader.readAsDataURL(file);
  }

  selectFile() {
    $('#file-input').click();
    return false;
  }

  async upload() {
    this.uploading = true;
    this.uploadProgress = 0;

    const file = new File(
      [await (await fetch(this.data.image)).blob()],
      'avatar.jpeg', { type: 'image/jpeg' }
    );

    return this.storageService.uploadFile(file).subscribe(uploadEvent => {
      switch (uploadEvent.type) {
        case UploadEventType.Progress:
          this.uploadProgress = uploadEvent.progress;
          break;
        case UploadEventType.Complete:
          this.uploading = false;
          const avatarMediaId = uploadEvent.medias[0].id;
          this.userService
            .patchUser(this.currentUser.id, { avatarMediaId })
            .subscribe(() => {
              $('#uploadImageModal').modal('hide');
            });
          break;
      }
    });
  }
}
