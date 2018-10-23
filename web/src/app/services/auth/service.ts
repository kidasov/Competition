import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api';
import { tap } from 'rxjs/operators';
import { AuthProvider } from './provider';
import { Id } from 'app/types/types';

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

interface VkSignInParams {
  code: string;
  redirect_uri: string;
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

  vkSignIn(params: VkSignInParams): Observable<SignInResponse> {
    return this.api.post('/auth/vk', params).pipe(
      tap((response: SignInResponse) => {
        const { sessionKey, userId } = response;
        this.authProvider.updateSessionKey(sessionKey, userId);
      }),
    );
  }
}
