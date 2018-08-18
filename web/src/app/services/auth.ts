import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

const LS_SESSION_KEY = 'session_key';

@Injectable({
  providedIn: 'root',
})
export class AuthProvider {
  sessionKey: string | null;
  authorized = new Subject<boolean>();

  constructor() {
    this.sessionKey = localStorage.getItem(LS_SESSION_KEY);
    this.authorized.next(this.sessionKey != null);
  }

  invalidateSessionKey() {
    localStorage.removeItem(LS_SESSION_KEY);
    this.sessionKey = null;
    this.authorized.next(false);
  }

  updateSessionKey(sessionKey: string) {
    localStorage.setItem(LS_SESSION_KEY, sessionKey);
    this.sessionKey = sessionKey;
    this.authorized.next(true);
  }
}
