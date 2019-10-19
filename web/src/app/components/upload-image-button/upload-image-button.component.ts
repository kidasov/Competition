import { Component, OnInit, ViewChild } from '@angular/core';
import $ from 'jquery';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';

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
  data = {};
  cropperSettings = new CropperSettings({
    width: 600,
    height: 600,
    croppedWidth: 100,
    croppedHeight: 100,
    canvasWidth: 600,
    canvasHeight: 600,
    noFileInput: true,
  });
  inputImage = null;

  constructor() {}

  ngOnInit() {}

  fileChangeListener($event) {
    const image = new Image();

    image.onload = () => {
      const ratio = image.width / image.height;
      console.log('ratio', ratio, image.width, image.height);
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
}
