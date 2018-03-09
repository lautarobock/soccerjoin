import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Session } from '../../services/session.service';
import { UsersService } from '../../services/users.service';
import { MatchesService } from '../../services/matches.service';
import { Match } from '../../domain/model';
import { Action } from '../toolbar/toolbar.component';
import { MatInput, MatFormField } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'sj-home',
  templateUrl: './home.component.html',
  styles: [`
:host mat-tab-group {
  height: calc(100vh - 64px)
}
  `]
})
export class HomeComponent implements OnInit {

  actions: Action[];
  matches: Match[];
  allMatches: Match[];
  searchMode = false;
  searchText = '';
  searchTerms = new Subject<string>();
  @ViewChild('searchBox') searchBox: ElementRef;

  constructor(
    public session: Session,
    private userService: UsersService,
    private matchesService: MatchesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.search();
    this.searchTerms.pipe(debounceTime(500)).subscribe(() => this.search());
    this.actions = [{
      styleName: 'fas fa-lg fa-search',
      text: 'Search',
      click: () => {
        this.searchMode = true;
        setTimeout(() => this.searchBox.nativeElement.focus());
      },
      menu: false
    }];
  }

  search() {
    this.matchesService.allMatches(this.searchText).subscribe(matches => {
      this.allMatches = matches;
      this.matches = matches.filter(match => match.owner._id.toString() === this.session.loggedUser()._id.toString());
    });
  }

  blurSearchBox() {
    this.searchMode = this.searchText.trim() !== '';
  }

  import() {
    if (this.session.loggedUser().strava) {
      this.router.navigate(['/importer/strava']);
    } else if (this.session.loggedUser().endomondo) {
      this.router.navigate(['/importer/endomondo']);
    } else  {

    }
  }
}
