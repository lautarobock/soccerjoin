import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Session } from './services/session.service';
import { UsersService } from './services/users.service';
import { GeoService } from './services/geo.service';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  loading = false;

  constructor(
    public session: Session,
    private userService: UsersService,
    private geoService: GeoService,
    private router: Router,
    private spinner: SpinnerService
  ) { }

  ngOnInit() {
    if (this.session.token() && !this.session.loggedUser()) {
      this.userService.me().subscribe(me => this.session.registerUser(me));
    }
    this.spinner.onChange.subscribe(count => {
      if (count) {
        this.loading = true
      } else {
        this.loading = false
      }
    })
    // this.router.events.subscribe((event: any) => {
    //   if (event instanceof NavigationEnd) {
    //     console.log('end');
    //     this.loading = 0;
    //   }
    //   if (event instanceof NavigationStart) {
    //     console.log('start');
    //     this.loading = 1;
    //   }
    //   if (event instanceof NavigationCancel) {
    //     console.log('cancel');
    //     this.loading = 0;
    //   }
    // });
  }

}
