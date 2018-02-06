import { Component, OnInit, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Session } from './services/session.service';
import { UsersService } from './services/users.service';
import { GeoService } from './services/geo.service';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from './services/spinner.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ToolbarService {

  action: Action;
  change = new Subject<Action>();

  clear() {
    this.action = undefined;
    this.change.next(undefined);
  }

  set(styleName: string, text: string, click: () => void) {
    this.action = {
      styleName, text, click
    };
    setTimeout(() => this.change.next(this.action));
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  loading = false;
  action: Action;

  constructor(
    public session: Session,
    private userService: UsersService,
    private geoService: GeoService,
    private router: Router,
    private spinner: SpinnerService,
    private toolbarService: ToolbarService
  ) { }

  ngOnInit() {
    if (this.session.token() && !this.session.loggedUser()) {
      this.userService.me().subscribe(me => this.session.registerUser(me));
    }
    this.spinner.onChange.subscribe(count => {
      setTimeout(() => {
        if (count) {
          this.loading = true
        } else {
          this.loading = false
        }
      });
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        this.toolbarService.clear();
      }
    });
    this.toolbarService.change.subscribe(action => this.action = action);
  }

}

export class Action {
  styleName: string;
  text: string;
  click: () => void;
}