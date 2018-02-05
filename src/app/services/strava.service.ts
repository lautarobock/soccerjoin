import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from './session.service';
import { MatchesService } from './matches.service';
import { Match } from '../domain/model';

@Injectable()
export class StravaService {

  private readonly baseUrl = 'https://www.strava.com/api/v3';

  constructor(
    private http: HttpClient,
    private session: Session,
    private matchesService: MatchesService
  ) { }

  myActivities(): Promise<any[]> {
    return Promise.all([
        this.http.get<any[]>(`${this.baseUrl}/athlete/activities?access_token=${this.session.loggedUser().strava.access_token}`).toPromise(),
        this.matchesService.myMatches().toPromise()
      ])
      .then(responses => {
        const [activities, matches] = responses;
        return activities.filter(activity => matches.find((match: Match) => match.strava.id === activity.id) === undefined);
      });
  }

  streams(activityId: number) {
    return this.http.get(`https://www.strava.com/api/v3/activities/${activityId}/streams/time,latlng,heartrate,temp?access_token=${this.session.loggedUser().strava.access_token}`);
  }

  detail(activityId: number) {
    return this.http.get(`https://www.strava.com/api/v3/activities/${activityId}?access_token=${this.session.loggedUser().strava.access_token}`);
  }

}
