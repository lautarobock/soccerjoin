import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, User } from '../domain/model';
import { Session } from './session.service';
import { environment } from '../../environments/environment';

@Injectable()
export class UsersService {

  constructor(
    private http: HttpClient,
    private session: Session
  ) { }

  loginWithStrava(accesToken: string) {
    return this.http.get<LoginResponse>(`${environment.backendUrl}/api/users/token?type=strava&access_token=${accesToken}`)
  }

  me() {
    return this.http.get<User>(`${environment.backendUrl}/api/users/me`);
  }
  
}
