import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class MenuService {

  onOpen = new Subject();
  onClose = new Subject();

  constructor() { }

  open() {
    this.onOpen.next();
  }

  close() {
    this.onClose.next();
  }
}
