import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, User } from '../domain/model';
import { Session } from './session.service';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient,
    private session: Session
  ) { }

  loginWithStrava(accesToken: string) {
    return this.http.get<LoginResponse>(`/api/users/token?type=strava&access_token=${accesToken}`)
  }

  me() {
    return this.http.get<User>(`/api/users/me`, {
      headers: {
        'x-access-token': this.session.token()
      }
    });
  }
  
}
