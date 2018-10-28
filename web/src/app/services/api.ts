import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthProvider } from './auth/provider';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'http://localhost:3003';

  private errorHandler = tap(null, err => {
    if (err.status === 401) {
      this.authProvider.invalidateSessionKey();
    }
  });

  constructor(private http: HttpClient, private authProvider: AuthProvider) {}

  get(path: string): Observable<any> {
    return this.http
      .get(this.formatUrl(path), this.options)
      .pipe(this.errorHandler);
  }

  post(path: string, body: any): Observable<any> {
    return this.http
      .post(this.formatUrl(path), body, this.options)
      .pipe(this.errorHandler);
  }

  patch(path: string, body: any): Observable<any> {
    return this.http
      .patch(this.formatUrl(path), body, this.options)
      .pipe(this.errorHandler);
  }

  put(path: string, body: any): Observable<any> {
    return this.http
      .put(this.formatUrl(path), body, this.options)
      .pipe(this.errorHandler);
  }

  delete(path: string): Observable<any> {
    return this.http
      .delete(this.formatUrl(path), this.options)
      .pipe(this.errorHandler);
  }

  upload<T>(path: string, formData: FormData): Observable<HttpEvent<T>> {
    const req = new HttpRequest('POST', this.formatUrl(path), formData, {
      ...this.options,
      reportProgress: true,
    });

    return this.http.request(req);
  }

  private formatUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private get options(): RequestOptions {
    let headers = new HttpHeaders();
    const sessionKey = this.authProvider.sessionKey;
    if (sessionKey != null) {
      headers = headers.append('Authorization', sessionKey);
    }
    return { headers };
  }
}

interface RequestOptions {
  headers?: HttpHeaders;
}
