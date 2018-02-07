import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { StravaComponent } from './strava/strava.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatButtonModule, MatListModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatSliderModule, MatExpansionModule, MatSlideToggleModule, MatSnackBarModule, MatDialogModule, MatCardModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../services/auth.guard';
import { StravaImporterComponent } from './strava-importer/strava-importer.component';
import { MatchDetailComponent } from './matches/match-detail/match-detail.component';
import { MatchResolver } from './matches/match-resolver.service';
import { FormsModule } from '@angular/forms';
import { MatchListComponent } from './matches/match-list/match-list.component';
import { JoinDialogComponent, JoinDialog } from './matches/join-dialog/join-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
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
        path: 'matches/:id',
        component: MatchDetailComponent,
        resolve: {
          match: MatchResolver
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'strava/importer',
        component: StravaImporterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
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
    HomeComponent,
    StravaImporterComponent,
    MatchDetailComponent,
    MatchListComponent,
    JoinDialogComponent
  ],
  entryComponents: [
    JoinDialogComponent
  ],
  providers: [
    MatchResolver,
    JoinDialog
  ]
})
export class ScreensModule { }
