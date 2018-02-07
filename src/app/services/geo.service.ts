import { Injectable } from '@angular/core';

@Injectable()
export class GeoService {

  private position: Position;

  constructor() {
    this.loadPosition().then(pos => this.position = pos);
  }

  private loadPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => resolve(position));
      } else {
        reject();
      }
    });
  }

  last(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (this.position) {
        resolve(this.position.coords);
      } else {
        this.loadPosition().then(pos => {
          this.position = pos;
          resolve(pos.coords);
        })
          .catch(err => reject(err));
      }
    });
  }

}
