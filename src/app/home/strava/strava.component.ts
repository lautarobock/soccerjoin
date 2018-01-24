import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AgmMap, GoogleMapsAPIWrapper } from '@agm/core';

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
  // map: any;
  heatmap: any;
  zoom = 22;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
    // private wrapper: GoogleMapsAPIWrapper
  ) { }

  mapReady(map) {
    console.log('MAP', map);
    // this.map = map;
    this.heatmap = new google.maps.visualization.HeatmapLayer({ map });
  }

  ngOnInit() {
    // setTimeout(() => console.log('MAPA', google.maps.visualization.HeatmapLayer), 1000);
    if (localStorage.getItem('strava_token')) {
      this.loadActivities();
    } else {
      this.route.queryParams.subscribe((params: Params) => {
        this.http.post(`https://www.strava.com/oauth/token?client_id=22846&client_secret=c06a0e6204ee08ce943656ff946af4b331aa8f5b&code=${params.code}`, {})
          .subscribe(
          data => {
            localStorage.setItem('strava_token', JSON.stringify(data));
            this.loadActivities();
          },
          err => console.error(err)
          );
      });
    }
    
    this.http.get('/api/test').subscribe(data => console.log('TEST', data));
  }

  loadActivities() {
    this.token = JSON.parse(localStorage.getItem('strava_token'));
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

        this.heatmap.setData(data[0].data.map(point => new google.maps.LatLng(point[0], point[1])));
      }
    );
  }

  time(date, offset) {
    return new Date(new Date(date).getTime() + offset * 1000);
  }
}
