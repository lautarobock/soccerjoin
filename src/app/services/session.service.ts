import { Injectable } from '@angular/core';
import { last } from '@angular/router/src/utils/collection';
import { User } from '../domain/model';

@Injectable()
export class Session {

  private readonly localStorageKey = 'soccerJoinToken';
  private user: User;

  constructor() { }

  token() {
    let token = localStorage.getItem(this.localStorageKey);
    if (token === null) {
      token = undefined;
    }
    if (token === '') {
      token = undefined;
    }
    return token;
  }

  registerToken(jwt: string) {
    localStorage.setItem(this.localStorageKey, jwt);
  }

  clearToken() {
    localStorage.removeItem(this.localStorageKey);
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
