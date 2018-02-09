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
    this.updateDescription(match.name);
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
}
