import { Component, OnInit, Injectable, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
import { Platform } from './tools/platform.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuService } from './screens/menu/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
mat-sidenav {
  width: 300px;
}
  `]
})
export class AppComponent implements OnInit, OnDestroy {

  sideOpen = false;
  mobileQuery: MediaQueryList;
  loading = false;
  private mobileQueryListener: () => void;

  constructor(
    public session: Session,
    private userService: UsersService,
    private geoService: GeoService,
    private router: Router,
    private platform: Platform,
    private menuService: MenuService,
    private spinner: SpinnerService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
    this.sideOpen = !this.mobileQuery.matches;
  }

  get sideNavMode() {
    return this.mobileQuery.matches ? 'over' : 'side';
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }

  ngOnInit() {
    if (this.session.token() && !this.session.loggedUser()) {
      this.userService.me().subscribe(me => this.session.registerUser(me));
    }
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (this.platform.isBrowser()) {
          window.scrollTo(0, 0)
        }
      }
    });
    this.menuService.onOpen.subscribe(() => this.sideOpen = !this.sideOpen);
    this.menuService.onClose.subscribe(() => {
      if (this.mobileQuery.matches) {
        this.sideOpen = false;
      }
    });
    this.spinner.onChange.subscribe(count => {
      setTimeout(() => {
        if (count) {
          this.loading = true
        } else {
          this.loading = false
        }
      });
    });
  }

}
