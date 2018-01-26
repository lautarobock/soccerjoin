import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { StravaComponent } from './strava/strava.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatButtonModule, MatListModule, MatIconModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../services/auth.guard';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    AgmCoreModule.forRoot({
      libraries: ['visualization'],
      apiKey: 'AIzaSyAp9Ii0KhgZ435TgTy0JZsMLekx4087Bfg' // SoccerJoin proyect and app
    }),
    RouterModule.forChild([
      {
        path: 'login/strava',
        component: StravaComponent
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: '',
        component: HomeComponent
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
      }

    ])
  ],
  exports: [
    // LoginComponent,
    // StravaComponent
  ],
  declarations: [
    LoginComponent,
    StravaComponent,
    HomeComponent
  ]
})
export class ScreensModule { }
