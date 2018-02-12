import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../services/session.service';
import { MatchesService } from '../../services/matches.service';
import { Router } from '@angular/router';
import { GeoService } from '../../services/geo.service';
import { StravaService } from '../../services/strava.service';
import { Match } from '../../domain/model';
declare var google: any;

@Component({
  selector: 'sj-strava-importer',
  templateUrl: './strava-importer.component.html',
  styles: [`
agm-map {
  height: 350px;
}
  `]
})
export class StravaImporterComponent implements OnInit {

  token: any;
  data: any;
  details = [];
  selected: any;
  activityFull: any;
  lat: number;
  lng: number;
  centerLat: number;
  centerLng: number;
  heatmap: any;
  zoom = 22;

  constructor(
    private http: HttpClient,
    private session: Session,
    private matchesService: MatchesService,
    private router: Router,
    private geoService: GeoService,
    private stravaService: StravaService
  ) { }

  ngOnInit() {
    this.loadActivities();
  }

  mapReady(map) {
    this.heatmap = new google.maps.visualization.HeatmapLayer({ map });
    this.geoService.last().then(coordinates => {
      this.lat = coordinates.latitude;
      this.lng = coordinates.longitude;
    })
  }

  loadActivities() {
    this.stravaService.myActivities().then(data => this.data = data);
  }

  showInfo(item) {
    this.selected = item;
    this.stravaService.streams(item.id).subscribe((data: any[]) => {
        this.details = data;
        this.heatmap.setData(data[0].data.map(point => new google.maps.LatLng(point[0], point[1])));
        const point = data[0].data.reduce((prev, current) => {
          return [
            prev[0] + current[0],
            prev[1] + current[1]
          ]
        });
        this.lat = point[0] / data[0].data.length;
        this.lng = point[1] / data[0].data.length;
      }
    );
    this.stravaService.detail(item.id).subscribe(
      (activity: any[]) => this.activityFull = activity
    );
    
  }

  time(date, offset) {
    return new Date(new Date(date).getTime() + offset * 1000);
  }

  import() {
    this.matchesService.create({
      name: this.activityFull.name,
      strava: {
        id: this.activityFull.id,
        external_id: this.activityFull.external_id
      },
      averageHeartRate: this.activityFull.average_heartrate,
      distance: this.activityFull.distance,
      movingTime: this.activityFull.moving_time,
      elapsedTime: this.activityFull.elapsed_time,
      startDate: this.activityFull.start_date,
      averageSpeed: this.activityFull.average_speed,
      maxSpeed: this.activityFull.max_speed,
      maxHeartRate: this.activityFull.max_heartrate,
      calories: this.activityFull.calories,
      center: {
        lat: this.lat,
        lng: this.lng
      },
      streams: {
        time: this.details.find(d => d.type === 'time').data,
        distance: this.details.find(d => d.type === 'distance').data,
        heartRate: this.details.find(d => d.type === 'heartrate').data,
        latlng: this.details.find(d => d.type === 'latlng').data.map(p => ({lat: p[0], lng: p[1]}))
      },
      owner: undefined
    } as Match).subscribe(
      response => this.router.navigate(['/matches', response._id]),
      err => console.error(err)
    )
  }
}
