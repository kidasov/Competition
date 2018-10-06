import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserData } from '../../models/user';
import { ApiService } from '../api';
import { tap } from 'rxjs/operators';
import { AuthProvider } from './provider';

interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface SignInResponse {
  sessionKey: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiService, private authProvider: AuthProvider) {}

  signUp(params: SignUpParams): Observable<SignInResponse> {
    return this.api.post('/auth/signup', params).pipe(
      tap((response: SignInResponse) => {
        const { sessionKey } = response;
        this.authProvider.updateSessionKey(sessionKey);
      }),
    );
  }

  signIn(params: SignInParams) {
    return this.api.post('/auth/signin', params).pipe(
      tap((response: SignInResponse) => {
        const { sessionKey } = response;
        this.authProvider.updateSessionKey(sessionKey);
      }),
    );
  }
}
