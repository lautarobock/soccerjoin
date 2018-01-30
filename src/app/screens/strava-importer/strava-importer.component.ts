import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session.service';
declare var google: any;

@Component({
  selector: 'sj-strava-importer',
  templateUrl: './strava-importer.component.html',
  styles: [`
agm-map {
  height: 500px;
}
  `]
})
export class StravaImporterComponent implements OnInit {

  token: any;
  data: any;
  details = [];
  selected: any;
  lat = -34.649504;
  lng = -58.566103;
  heatmap: any;
  zoom = 22;

  constructor(
    private http: HttpClient,
    private session: Session
  ) { }

  ngOnInit() {
    this.loadActivities();
  }

  mapReady(map) {
    this.heatmap = new google.maps.visualization.HeatmapLayer({ map });
  }

  loadActivities() {
    this.http.get(`https://www.strava.com/api/v3/athlete/activities?access_token=${this.session.loggedUser().strava.access_token}`).subscribe(
      data => this.data = data
    );
  }

  showInfo(item) {
    this.selected = item;
    this.http.get(`https://www.strava.com/api/v3/activities/${item.id}/streams/time,latlng,heartrate,temp?access_token=${this.session.loggedUser().strava.access_token}`).subscribe(
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
