import { Injectable } from '@angular/core';
import { Platform } from './platform.service';

@Injectable()
export class LocalStorage {

  constructor(
    private platform: Platform
  ) { }

  remove(key: string) {
    if (this.platform.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  set(key: string, value: any) {
    if (this.platform.isBrowser()) {
      localStorage.setItem(key, this.convertToString(value));
    }
  }

  getString(key: string): string {
    if (this.platform.isBrowser()) {
      return localStorage.getItem(key);
    } else {
      return undefined;
    }
  }

  private convertToString(value: any) {
    if (typeof value === 'string') {
      return value;
    } else {
      return JSON.stringify(value);
    }
  }
}
