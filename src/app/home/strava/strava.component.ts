import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sj-strava',
  templateUrl: './strava.component.html',
  styles: []
})
export class StravaComponent implements OnInit {
  
  token: any;
  data: any;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    if (localStorage.getItem('strava_token')) {
      this.loadActivities();
    } else {
      this.route.queryParams.subscribe((params: Params) => {
        this.httpClient.post(`https://www.strava.com/oauth/token?client_id=22846&client_secret=c06a0e6204ee08ce943656ff946af4b331aa8f5b&code=${params.code}`, {})
          .subscribe(
            data => {
              localStorage.setItem('strava_token', JSON.stringify(data));
              this.loadActivities();      
            },
            err => console.error(err)
          );
      });
    }
  }

  loadActivities() {
    this.token = JSON.parse(localStorage.getItem('strava_token'));
    this.httpClient.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${this.token.access_token}`).subscribe(
      data => this.data = data
    );
  }

}
