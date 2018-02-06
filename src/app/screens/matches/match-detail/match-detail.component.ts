import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Match } from '../../../domain/model';
declare var google: any;

@Component({
  selector: 'sj-match-detail',
  templateUrl: './match-detail.component.html',
  styles: [`
agm-map {
  height: 350px;
}
  `]
})
export class MatchDetailComponent implements OnInit {

  match: Match;
  heatmap: any;
  lat: number;
  lng: number;
  maxTime = 0;
  currentTime = 0;
  pointRadius = 10;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((routeData: {match: Match}) => {
      this.match = routeData.match;
      this.maxTime = Math.round(this.match.streams.time[this.match.streams.time.length-1] / 60);
      this.currentTime = this.maxTime;
      // this.lat = this.match.streams.latlng[0].lat;
      // this.lng = this.match.streams.latlng[0].lng;
      // const point = this.match.streams.latlng.reduce((prev, current) => {
      //   return {
      //     lat: prev.lat + current.lat,
      //     lng: prev.lng + current.lng
      //   }
      // });
      // this.lat = point.lat / this.match.streams.latlng.length;
      // this.lng = point.lng / this.match.streams.latlng.length;
    });
  }
  
  mapReady(map) {
    this.heatmap = new google.maps.visualization.HeatmapLayer({ map, radius: this.pointRadius });
    this.heatmap.setData(this.match.streams.latlng.map(p => new google.maps.LatLng(p.lat, p.lng)));
  }
}
