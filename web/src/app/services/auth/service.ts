import { Injectable } from '@angular/core';
import { Id } from 'app/types/types';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../api';
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
  userId: Id;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private api: ApiService, private authProvider: AuthProvider) {}

  signUp(params: SignUpParams): Observable<SignInResponse> {
    return this.api.post('/auth/signup', params).pipe(
      tap((response: SignInResponse) => {
        const { sessionKey, userId } = response;
        this.authProvider.updateSessionKey(sessionKey, userId);
      }),
    );
  }

  signIn(params: SignInParams) {
    return this.api.post('/auth/signin', params).pipe(
      tap((response: SignInResponse) => {
        const { sessionKey, userId } = response;
        this.authProvider.updateSessionKey(sessionKey, userId);
      }),
    );
  }
}
