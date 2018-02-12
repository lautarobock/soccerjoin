import { Component, OnInit } from '@angular/core';
import { Action } from '../../toolbar/toolbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Match } from '../../../domain/model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatchesService } from '../../../services/matches.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'sj-match-edit',
  templateUrl: './match-edit.component.html',
  styles: [`
.form-container {
  display: flex;
  flex-direction: column;
  margin: 1em;
}
  
.form-container > * {
  width: 100%;
}
  `]
})
export class MatchEditComponent implements OnInit {

  actions: Action[];
  match: Match;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private matchesService: MatchesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.data.subscribe((routeData: { match: Match }) => this.match = routeData.match);
    this.actions = [{
      styleName: 'fas fa-lg fa-save',
      text: 'Save changes',
      click: () => this.save(),
      menu: false
    }];
    this.form = this.fb.group({
      name: this.match.name
    });
  }

  cancel() {
    if (this.form.dirty && confirm('Are you sure to discard changs?') || !this.form.dirty) {
      this.router.navigate(['/matches', this.match._id]);  
    }
  }

  private save() {
    this.matchesService.update(this.match._id, this.form.value).subscribe(
      () => this.router.navigate(['/matches', this.match._id]),
      err => this.snackBar.open(err, 'CLOSE')
    );
  }

}
