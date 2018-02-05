import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from './session.service';
import { Match } from '../domain/model';
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
  
}
