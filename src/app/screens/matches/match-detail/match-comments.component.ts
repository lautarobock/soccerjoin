import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Match, Comment } from '../../../domain/model';
import { Session } from '../../../services/session.service';
import { MatchesService } from '../../../services/matches.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'sj-match-comments',
  templateUrl: './match-comments.component.html',
  styles: []
})
export class MatchCommentsComponent implements OnInit {

  @Input() match: Match;
  @ViewChild('input') input: ElementRef;
  newComment = false;
  newCommentText = '';
  saving = false;

  constructor(
    private session: Session,
    private matchesService: MatchesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

  }

  add() {
    this.newComment = true;
    setTimeout(() => {
      this.input.nativeElement.focus();
      window.scrollTo(0,document.body.scrollHeight);
    });
  }

  save() {
    this.saving = true;
    this.matchesService.comment(this.match, this.newCommentText).subscribe(
      match => {
        console.log(match);
        this.match.comments.push({
          creationDate: new Date(),
          modificationDate: new Date(),
          text: this.newCommentText,
          owner: this.session.loggedUser()
        } as Comment);
        this.clearNew();
        this.saving = false;
      },
      err => {
        console.error(err);
        this.saving = false;
        this.snackBar.open('Ups, it was a problem, try again.', 'CLOSE');
      }
    );
  }

  blur() {
    setTimeout(() => {
      if (this.saving || !this.newComment) {
        
      } else if (!this.saving && this.newComment && this.newCommentText.trim() === '' || confirm('Discard changes?')) {
        this.clearNew();
      }
    }, 500);
  }

  clearNew() {
    this.newComment = false;
    this.newCommentText = '';
  }

  remove(comment: Comment) {
    if(confirm('Are you sure to delete the comment?')) {
      this.matchesService.removeComment(this.match, comment).subscribe(
        () => {
          const idx = this.match.comments.findIndex(c => c._id === comment._id);
          this.match.comments.splice(idx, 1);
        },
        err => {
          console.error(err);
          this.snackBar.open('Ups, it was a problem, try again.', 'CLOSE');
        }
      );
    }
  }
}
