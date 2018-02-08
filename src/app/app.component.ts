import { Component, OnInit, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Session } from './services/session.service';
import { UsersService } from './services/users.service';
import { GeoService } from './services/geo.service';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from './services/spinner.service';
import { Subject } from 'rxjs/Subject';
import { PromptUpdateService } from './updates/prompt-update.service';
import { Action } from './screens/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  constructor(
    public session: Session,
    private userService: UsersService,
    private geoService: GeoService
  ) { }

  ngOnInit() {
    if (this.session.token() && !this.session.loggedUser()) {
      this.userService.me().subscribe(me => this.session.registerUser(me));
    }
  }

}
