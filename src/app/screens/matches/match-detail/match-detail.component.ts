import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Like, Match } from '../../../domain/model';
import { MatSliderChange, MatSlideToggleChange, MatSnackBar } from '@angular/material';
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
  availableJoins: Match[];
  isLike: boolean;
  isMine: boolean;

  constructor(
    private route: ActivatedRoute,
    private toolbarService: ToolbarService,
    private session: Session,
    private matchesService: MatchesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.data.subscribe((routeData: { match: Match }) => {
      this.match = routeData.match;
      this.maxTime = this.match.streams.time.length - 1;
      this.currentTime = this.maxTime;
      this.isMine = this.match.owner._id === this.session.loggedUser()._id;
      if (this.isMine) {
        this.toolbarService.set('fas fa-edit', 'Edit Match', () => console.log('edit'));
      } else {
        // this.matchesService.myMatches().subscribe(myMatches => {
        //   // les than 3 hours
        //   this.availableJoins = myMatches.filter(match => Math.abs(new Date(match.startDate).getTime() - new Date(this.match.startDate).getTime()) < 3 * 60 * 60 * 1000);
        // });
      }
      this.isLike = this.match.likes.find(like => like.owner === this.session.loggedUser()._id) !== undefined;
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

  likeMyself() {
    this.snackBar.open('sure? like it to yourself? this is not gonna happen', '', {
      duration: 2000
    });
  }

  toDate(ms: number) {
    return new Date(0,0,0,0,0,0,ms);
  }

  private unlike() {
    this.matchesService.unlike(this.match).subscribe(() => {
      const idx = this.match.likes.findIndex(like => like.owner === this.session.loggedUser()._id);
      this.match.likes.splice(idx, 1);
      this.isLike = false;
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
      this.isLike = true;
    });
  }
}
