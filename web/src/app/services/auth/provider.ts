import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Id } from 'app/types/types';

const LS_SESSION_KEY = 'session_key';
const LS_USER_ID = 'user_id';

interface UserInfo {
  authorized: boolean;
  userId: Id;
}

@Injectable({
  providedIn: 'root',
})
export class AuthProvider {
  sessionKey: string | null;
  userInfo = new BehaviorSubject<UserInfo>({ authorized: false, userId: null });

  constructor() {
    this.sessionKey = localStorage.getItem(LS_SESSION_KEY);
    const userId = +localStorage.getItem(LS_USER_ID);
    this.userInfo.next({
      authorized: this.sessionKey != null,
      userId: !Number.isNaN(userId) ? userId : null,
    });
  }

  invalidateSessionKey() {
    localStorage.removeItem(LS_SESSION_KEY);
    localStorage.removeItem(LS_USER_ID);
    this.sessionKey = null;
    this.userInfo.next({
      authorized: false,
      userId: null,
    });
  }

  updateSessionKey(sessionKey: string, userId: Id) {
    localStorage.setItem(LS_SESSION_KEY, sessionKey);
    localStorage.setItem(LS_USER_ID, `${userId}`);
    this.sessionKey = sessionKey;
    this.userInfo.next({
      authorized: true,
      userId,
    });
  }

  get userId() {
    return this.userInfo.value.userId;
  }

  get authorized() {
    return this.userInfo.value.authorized;
  }
}
