import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Id } from 'app/types/types';

const LS_SESSION_KEY = 'session_key';
const LS_USER_ID = 'user_id';

@Injectable({
  providedIn: 'root',
})
export class AuthProvider {
  sessionKey: string | null;
  userId: Id;
  authorized = new BehaviorSubject<boolean>(false);

  constructor() {
    this.sessionKey = localStorage.getItem(LS_SESSION_KEY);
    const userId = +localStorage.getItem(LS_USER_ID);
    this.userId = !Number.isNaN(userId) ? userId : null;
    this.authorized.next(this.sessionKey != null);
  }

  invalidateSessionKey() {
    localStorage.removeItem(LS_SESSION_KEY);
    localStorage.removeItem(LS_USER_ID);
    this.sessionKey = null;
    this.userId = null;
    this.authorized.next(false);
  }

  updateSessionKey(sessionKey: string, userId: Id) {
    localStorage.setItem(LS_SESSION_KEY, sessionKey);
    localStorage.setItem(LS_USER_ID, `${userId}`);
    this.sessionKey = sessionKey;
    this.userId = userId;
    this.authorized.next(true);
  }
}
