import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Session } from './services/session.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  constructor(
    public session: Session,
    private userService: UsersService
  ) {}

  ngOnInit() {
    if (this.session.token() && !this.session.loggedUser()) {
      this.userService.me().subscribe(me => this.session.registerUser(me));
    }
  }

}
