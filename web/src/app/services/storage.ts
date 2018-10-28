import { HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api';

export enum UploadEventType {
  Progress,
  Complete,
}

export interface UploadProgress {
  type: UploadEventType.Progress;
  progress: number;
}

export interface UploadComplete {
  type: UploadEventType.Complete;
  uploadId: number;
}

export type UploadEvent = UploadProgress | UploadComplete;

interface UploadResponse {
  uploadId: number;
}

function uploadProgress(progress: number): UploadProgress {
  return {
    type: UploadEventType.Progress,
    progress,
  };
}

function uploadComplete(uploadId: number): UploadComplete {
  return {
    type: UploadEventType.Complete,
    uploadId,
  };
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private api: ApiService) {}

  public uploadFile(file: File): Observable<UploadEvent> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.api.upload<UploadResponse>('/storage', formData).pipe(
      map(httpEvent => {
        switch (httpEvent.type) {
          case HttpEventType.Sent:
            return uploadProgress(0);
          case HttpEventType.UploadProgress:
            return uploadProgress(httpEvent.loaded / httpEvent.total);
          case HttpEventType.Response:
            return uploadComplete(httpEvent.body.uploadId);
          default:
            return uploadProgress(1);
        }
      }),
    );
  }
}
