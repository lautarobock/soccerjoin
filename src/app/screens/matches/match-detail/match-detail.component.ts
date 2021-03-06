import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Like, Match } from '../../../domain/model';
import { MatSliderChange, MatSlideToggleChange, MatSnackBar } from '@angular/material';
import { Session } from '../../../services/session.service';
import { MatchesService } from '../../../services/matches.service';
import { JoinDialog } from '../join-dialog/join-dialog.component';
import { Action } from '../../toolbar/toolbar.component';
import { MetaData } from '../../../tools/meta-data.service';
import { Platform } from '../../../tools/platform.service';
declare var google: any;

@Component({
  selector: 'sj-match-detail',
  templateUrl: './match-detail.component.html',
  styles: [`
agm-map {
  height: 350px;
}
.example-button-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
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
  joinMatches: Match[];
  isLike: boolean;
  isMine: boolean;
  isJoin: boolean;
  actions: Action[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public session: Session,
    private matchesService: MatchesService,
    private snackBar: MatSnackBar,
    private joinDialog: JoinDialog,
    private metaData: MetaData,
    public platform: Platform
  ) { }

  ngOnInit() {
    this.route.data.subscribe((routeData: { match: Match }) => this.loadData(routeData.match));
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
    return new Date(0, 0, 0, 0, 0, 0, ms);
  }

  unlike() {
    this.matchesService.unlike(this.match).subscribe(() => {
      const idx = this.match.likes.findIndex(like => like.owner === this.session.loggedUser()._id);
      this.match.likes.splice(idx, 1);
      this.isLike = false;
    });
  }

  like() {
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

  join() {
    this.joinDialog.open(this.match).afterClosed().subscribe(
      isJoin => {
        console.log('isJoin', isJoin);
        if (isJoin) {
          this.matchesService.get(this.match._id).subscribe(
            match => this.loadData(match)
          );
        }
      }
    );
  }

  get chartMatches(): Match[] {
    if (this.isJoin===undefined) {
      return undefined;
    } else if (this.joinMatches && this.joinMatches.length) {
      return [this.match].concat(this.joinMatches);
    } else {
      return [this.match];
    }
  }

  private loadData(match: Match) {
    this.match = match;
    this.maxTime = this.match.streams.time.length - 1;
    this.currentTime = this.maxTime;
    this.metaData.match(this.match);
    if (this.heatmap) {
      this.heatmap.setData(this.match.streams.latlng.map(p => new google.maps.LatLng(p.lat, p.lng)));
    }
    if (this.session.token()) {
      this.isMine = this.match.owner._id === this.session.loggedUser()._id;
      if (this.isMine) {
        this.actions = [{
          styleName: 'fas fa-lg fa-edit',
          text: 'Edit match',
          click: () => this.router.navigate(['/matches', this.match._id, 'edit']),
          menu: false
        }, {
          styleName: 'fas fa-trash',
          text: 'Delete Match',
          click: () => this.deleteMatch(),
          menu: true
        }];
        if (navigator['share']) {
          this.actions.push({
            styleName: 'fas fa-lg fa-share-alt',
            text: 'Share',
            click: () => this.share(),
            menu: false
          });
        }
      }
      this.isLike = this.match.likes.find(like => like.owner === this.session.loggedUser()._id) !== undefined;
      if (this.match.join) {
        Promise.all(
          this.match.join.matches
            .filter(m => m !== this.match._id)
            .map(match => this.matchesService.get(match as string).toPromise())
        )
          .then(matches => {
            this.joinMatches = matches;
            this.isJoin = this.joinMatches.find(match => match.owner._id === this.session.loggedUser()._id) !== undefined;
          })
      } else {
        this.isJoin = false;
      }
    } else {
      this.isJoin = false;
    }
    
  }

  private deleteMatch() {
    if (this.match.join) {
      alert('This match is joined to another, you cannot remove it');
    } else if (confirm('Are you sure you want to remove it?')) {
      this.matchesService.remove(this.match._id).subscribe(
        () => {
          this.snackBar.open('Match removed', 'CLOSE', { duration: 2000 });
          this.router.navigate(['/matches']);
        },
        err => this.snackBar.open(err, 'CLOSE')
      );
    }
  }

  private share() {
    (navigator as any).share({
      title: this.match.name,
      text: `${this.session.loggedUser().name} wants to share with you a Match from SoccerJoin`,
      url: window.location.href,
    });
  }
}
