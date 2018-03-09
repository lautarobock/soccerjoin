import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from './session.service';
import { UsersService } from './users.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { MatchesService } from './matches.service';
import { AuthInterceptorService } from './auth-interceptor.service';
import { GeoService } from './geo.service';
import { StravaService } from './strava.service';
import { SpinnerInterceptorService } from './spinner-interceptor.service';
import { SpinnerService } from './spinner.service';
import { EndomondoService } from './endomondo.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  // exports: [Session, UsersService],
  providers: [
    Session,
    UsersService,
    AuthGuard,
    MatchesService,
    GeoService,
    StravaService,
    SpinnerService,
    EndomondoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptorService,
      multi: true
    }
  ]
})
export class ServicesModule { }
