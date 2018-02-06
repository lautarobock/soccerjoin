import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Like, Match } from '../../../domain/model';
import { MatSliderChange, MatSlideToggleChange } from '@angular/material';
import { ToolbarService } from '../../../app.component';
import { Session } from '../../../services/session.service';
import { MatchesService } from '../../../services/matches.service';
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
  showCentre = true;

  constructor(
    private route: ActivatedRoute,
    private toolbarService: ToolbarService,
    private session: Session,
    private matchesService: MatchesService
  ) { }

  ngOnInit() {
    this.route.data.subscribe((routeData: { match: Match }) => {
      this.match = routeData.match;
      this.maxTime = this.match.streams.time.length - 1;
      this.currentTime = this.maxTime;
      if (this.match.owner._id === this.session.loggedUser()._id) {
        this.toolbarService.set('fas fa-edit', 'Edit Match', () => console.log('edit'));
      } else if (this.match.likes.find(like => like.owner === this.session.loggedUser()._id) !== undefined) {
        this.toolbarService.set('fas fa-thumbs-up', 'I don\'t like it', () => this.unlike());
      } else {
        this.toolbarService.set('far fa-thumbs-up', 'I like it', () => this.like());
      }
    });
    
  }

  mapReady(map) {
    this.heatmap = new google.maps.visualization.HeatmapLayer({ map, radius: this.pointRadius });
    this.heatmap.setData(this.match.streams.latlng.map(p => new google.maps.LatLng(p.lat, p.lng)));
  }

  currentTimeChange(event: MatSliderChange) {
    this.heatmap.setData(
      this.match.streams.latlng
        .slice(0, event.value)
        .map(p => new google.maps.LatLng(p.lat, p.lng))
    );
  }

  radiusChange(event: MatSliderChange) {
    this.heatmap.set('radius', event.value);

  }

  private unlike() {
    this.matchesService.unlike(this.match).subscribe(() => {
      const idx = this.match.likes.findIndex(like => like.owner === this.session.loggedUser()._id);
      this.match.likes.splice(idx, 1);
      this.toolbarService.clear();
      this.toolbarService.set('far fa-thumbs-up', 'I Like it', () => this.like());
    });
  }

  private like() {
    this.matchesService.like(this.match).subscribe(() => {
      this.match.likes.push({
        date: new Date(),
        name: this.session.loggedUser().name,
        pictureUrl: this.session.loggedUser().pictureUrl,
        owner: this.session.loggedUser()._id
      });
      this.toolbarService.clear();
      this.toolbarService.set('fas fa-thumbs-up', 'I don\'t like it', () => this.unlike());
    });
  }
}
