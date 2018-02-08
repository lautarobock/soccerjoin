import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Platform } from '../tools/platform.service';

@Injectable()
export class PromptUpdateService {

  constructor(updates: SwUpdate, private platform: Platform) {
    if (this.platform.isBrowser()) {
      updates.available.subscribe(event => {
        if (confirm('There is new version available, do you want to update?')) {
          updates.activateUpdate().then(() => setTimeout(() => document.location.reload(), 500));
        }
      });
    }
  }

}
