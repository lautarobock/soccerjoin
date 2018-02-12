import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Session } from '../../services/session.service';
import { UsersService } from '../../services/users.service';
import { MatchesService } from '../../services/matches.service';
import { Match } from '../../domain/model';
import { Action } from '../toolbar/toolbar.component';
import { MatInput, MatFormField } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sj-home',
  templateUrl: './home.component.html',
  styles: []
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
    private matchesService: MatchesService
  ) { }

  ngOnInit() {
    this.search();
    this.searchTerms.pipe(debounceTime(500)).subscribe(() => this.search());
    this.actions = [{
      styleName: 'fas fa-search',
      text: 'Search',
      click: () => {
        this.searchMode = true;
        setTimeout(() => this.searchBox.nativeElement.focus());
      }
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

}
