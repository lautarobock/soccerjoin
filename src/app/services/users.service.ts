import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, User } from '../domain/model';
import { Session } from './session.service';
import { environment } from '../../environments/environment';
import { EndomondoAuthData } from './endomondo.service';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient,
    private session: Session
  ) { }

  loginWithStrava(accessToken: string) {
    return this.http.get<LoginResponse>(`${environment.backendUrl}/api/users/token?type=strava&access_token=${accessToken}`)
  }

  loginWithEndomondo(auth: EndomondoAuthData) {
    return this.http.get<LoginResponse>(`${environment.backendUrl}/api/users/token?type=endomondo&authToken=${auth.authToken}`)
  }

  signinWithStrava(accessToken: string) {
    return this.http.post<LoginResponse>(`${environment.backendUrl}/api/users/token?type=strava&access_token=${accessToken}`, {
      access_token: accessToken
    });
  }

  signinWithEndomondo(auth: EndomondoAuthData) {
    return this.http.post<LoginResponse>(`${environment.backendUrl}/api/users/token?type=endomondo`, {
      authToken: auth.authToken
    });
  }

  me() {
    return this.http.get<User>(`${environment.backendUrl}/api/users/me`);
  }
  
}
