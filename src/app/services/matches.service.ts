import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from './session.service';
import { Match, Comment, Join } from '../domain/model';
import { environment } from '../../environments/environment';

@Injectable()
export class MatchesService {

  constructor(
    private http: HttpClient,
    private session: Session
  ) { }

  myMatches() {
    return this.http.get<Match[]>(`${environment.backendUrl}/api/matches?owner=${this.session.loggedUser()._id}`);
  }

  allMatches(q: string) {
    return this.http.get<Match[]>(`${environment.backendUrl}/api/matches?q=${q}`);
  }

  create(match: Match) {
    return this.http.post<Match>(`${environment.backendUrl}/api/matches`, match);
  }

  get(id: string) {
    if (this.session.token()) {
      return this.http.get<Match>(`${environment.backendUrl}/api/matches/${id}`);
    } else {
      return this.http.get<Match>(`${environment.backendUrl}/public/matches/${id}`);
    }
  }

  update(matchId: string, changes: any) {
    return this.http.put<Match>(`${environment.backendUrl}/api/matches/${matchId}`, changes);
  }

  remove(matchId: string) {
    return this.http.delete<Match>(`${environment.backendUrl}/api/matches/${matchId}`);
  }

  like(match: Match) {
    return this.http.post<void>(`${environment.backendUrl}/api/matches/${match._id}/like`, {});
  }

  unlike(match: Match) {
    return this.http.delete<void>(`${environment.backendUrl}/api/matches/${match._id}/like`, {});
  }

  comment(match: Match, text: string) {
    return this.http.post<void>(`${environment.backendUrl}/api/matches/${match._id}/comments`, {text});
  }

  removeComment(match: Match, comment: Comment) {
    return this.http.delete<void>(`${environment.backendUrl}/api/matches/${match._id}/comments/${comment._id}`);
  }

  join(match: Match, to: Match) {
    return this.http.post<Join>(`${environment.backendUrl}/api/matches/${match._id}/join/${to._id}`, {});
  }
  
}
