import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SpinnerService {

  private count = 0;
  public onChange = new  Subject<number>();

  constructor() { }

  start() {
    this.count++
    if (this.count === 1) {
      this.onChange.next(this.count);
    }
  }

  stop() {
    this.count--;
    if (this.count === 0) {
      this.onChange.next(this.count);
    }
  }

}
