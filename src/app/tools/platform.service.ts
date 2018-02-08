import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class Platform {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
