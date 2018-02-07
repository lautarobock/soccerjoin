import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Match } from '../../../domain/model';
import { MatchesService } from '../../../services/matches.service';

@Component({
  selector: 'sj-join-dialog',
  templateUrl: './join-dialog.component.html',
  styles: []
})
export class JoinDialogComponent implements OnInit {

  availableJoins: Match[];

  constructor(
    public dialogRef: MatDialogRef<JoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public match: Match,
    private matchesService: MatchesService
  ) { }

  ngOnInit() {
    this.matchesService.myMatches().subscribe(myMatches => {
      // les than 3 hours
      this.availableJoins = myMatches.filter(match => Math.abs(new Date(match.startDate).getTime() - new Date(this.match.startDate).getTime()) < 3 * 60 * 60 * 1000);
    });
  }

  accept(matchToJoin: Match) {
    this.matchesService.join(this.match, matchToJoin).subscribe(
      join => this.dialogRef.close(true)
    );
  }

}

@Injectable()
export class JoinDialog {

  constructor(public dialog: MatDialog) { }

  open(match: Match) {
    return this.dialog.open(JoinDialogComponent, {data: match})  
  }
}
