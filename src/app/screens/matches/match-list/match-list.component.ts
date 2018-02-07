import { Component, OnInit, Input } from '@angular/core';
import { Match } from '../../../domain/model';

@Component({
  selector: 'sj-match-list',
  templateUrl: './match-list.component.html',
  styles: []
})
export class MatchListComponent implements OnInit {

  @Input() matches: Match[];

  constructor() { }

  ngOnInit() {
  }

}
