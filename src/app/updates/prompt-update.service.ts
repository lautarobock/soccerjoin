import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class PromptUpdateService {

  constructor(updates: SwUpdate) {
    console.log('check for updates');
    updates.available.subscribe(event => {
      if (confirm('There is new version available, do you want to update?')) {
        updates.activateUpdate().then(() => setTimeout(() => document.location.reload(), 500));
      }
    });
  }

}
