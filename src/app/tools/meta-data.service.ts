import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Match } from '../domain/model';

@Injectable()
export class MetaData {

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  match(match: Match) {
    this.title.setTitle(`SoccerJoin - ${match.name}`);
    this.updateTitle(`SoccerJoin - ${match.name}`);
    this.updateDescription(
      `Distance: ${(match.distance/1000).toFixed(2)} Km,
      Elapsed time: ${Math.round(match.elapsedTime / 60)} minutes,
      Calories: ${Math.round(match.calories)},
      PPM: ${Math.round(match.averageHeartRate)}`
    );
    this.updateImage(this.staticMap(match));
    this.updateURL(`https://soccerjoin-web.herokuapp.com/matches/${match._id}`);
  }

  private updateURL(url) {
    this.updateTag('og:url',url);
    this.updateTag('twitter:url',url);
  }

  private updateDescription(description) {
    this.updateTag('og:description', description);
    this.updateTag('twitter:description', description);
    this.updateTag('twitter:card', description);
  }

  private updateTitle(title) {
    this.updateTag('og:title', title);
    this.updateTag('twitter:title', title);
  }

  private updateTag(name, content) {
    this.meta.updateTag({content: content},`property="${name}"`);
  }
  
  private updateImage(url) {
    this.updateTag('og:image', url);
    this.updateTag('twitter:image', url);
  }

  private staticMap(match: Match) {
    return `https://maps.googleapis.com/maps/api/staticmap?markers=${match.center.lat},${match.center.lng}&zoom=20&key=AIzaSyAp9Ii0KhgZ435TgTy0JZsMLekx4087Bfg&size=480x320&maptype=satellite`;
  }
}
