import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from './session.service';
import { Match, Join } from '../domain/model';
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

  allMatches() {
    return this.http.get<Match[]>(`${environment.backendUrl}/api/matches`);
  }

  create(match: Match) {
    return this.http.post<Match>(`${environment.backendUrl}/api/matches`, match);
  }

  get(id: string) {
    return this.http.get<Match>(`${environment.backendUrl}/api/matches/${id}`);
  }

  like(match: Match) {
    return this.http.post<void>(`${environment.backendUrl}/api/matches/${match._id}/like`, {});
  }

  unlike(match: Match) {
    return this.http.delete<void>(`${environment.backendUrl}/api/matches/${match._id}/like`, {});
  }

  join(match: Match, to: Match) {
    return this.http.post<Join>(`${environment.backendUrl}/api/matches/${match._id}/join/${to._id}`, {});
  }
  
}
