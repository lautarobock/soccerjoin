import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { UsersService } from '../../services/users.service';
import { Session } from '../../services/session.service';

declare var google: any;

@Component({
  selector: 'sj-strava',
  templateUrl: './strava.component.html',
  styles: [`
agm-map {
  height: 500px;
}
  `]
})
export class StravaComponent implements OnInit {

  token: any;
  data: any;
  details = [];
  selected: any;
  lat = -34.649504;
  lng = -58.566103;
  heatmap: any;
  zoom = 22;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UsersService,
    private session: Session,
    private router: Router
  ) { }

  mapReady(map) {
    this.heatmap = new google.maps.visualization.HeatmapLayer({ map });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.http.post<any>(`https://www.strava.com/oauth/token?client_id=22846&client_secret=c06a0e6204ee08ce943656ff946af4b331aa8f5b&code=${params.code}`, {})
        .subscribe(
        data => {
          // this.token = data;
          // this.loadActivities();
          this.userService.loginWithStrava(data.access_token).subscribe(response => {
            this.session.registerToken(response.token);
            this.session.registerUser(response.user);
            this.router.navigate(['/home']);
          });
        },
        err => console.error(err)
        );
    });
  }

  loadActivities() {
    this.http.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${this.token.access_token}`).subscribe(
      data => this.data = data
    );
  }

  showInfo(item) {
    this.selected = item;
    this.http.get(`https://www.strava.com/api/v3/activities/${item.id}/streams/time,latlng,heartrate,temp?access_token=${this.token.access_token}`).subscribe(
      (data: any[]) => {
        this.details = data;
        this.lat = data[0].data[0][0];
        this.lng = data[0].data[0][1];

        // let i = 0;
        // const points = data[0].data.map(point => new google.maps.LatLng(point[0], point[1]));
        // setInterval(() => this.heatmap.setData(points.slice(0,i++)), 100);
        this.heatmap.setData(data[0].data.map(point => new google.maps.LatLng(point[0], point[1])));
      }
    );
  }

  time(date, offset) {
    return new Date(new Date(date).getTime() + offset * 1000);
  }
}
