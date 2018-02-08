import { Injectable } from '@angular/core';
import { last } from '@angular/router/src/utils/collection';
import { User } from '../domain/model';
import { LocalStorage } from '../tools/local-storage.service';

@Injectable()
export class Session {

  private readonly localStorageKey = 'soccerJoinToken';
  private user: User;

  constructor(private localStorage: LocalStorage) { }

  token() {
    let token = this.localStorage.getString(this.localStorageKey);
    if (token === null) {
      token = undefined;
    }
    if (token === '') {
      token = undefined;
    }
    return token;
  }

  registerToken(jwt: string) {
    this.localStorage.set(this.localStorageKey, jwt);
  }

  clearToken() {
    this.localStorage.remove(this.localStorageKey);
  }

  registerUser(user: User) {
    this.user = user;
  }

  loggedUser() {
    return this.user;
  }

  clearUser() {
    this.user = undefined;
  }

  clearSession() {
    this.clearUser();
    this.clearToken();
  }
}
