import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { UsersService } from '../../services/users.service';
import { Session } from '../../services/session.service';

@Component({
  selector: 'sj-strava',
  templateUrl: './strava.component.html'
})
export class StravaComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private userService: UsersService,
    private session: Session,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.http.post<any>(`https://www.strava.com/oauth/token?client_id=22846&client_secret=c06a0e6204ee08ce943656ff946af4b331aa8f5b&code=${params.code}`, {})
        .subscribe(
        data => {
          // this.token = data;
          // this.loadActivities();
          this.userService.loginWithStrava(data.access_token).subscribe(response => {
            this.session.registerToken(response.token);
            this.session.registerUser(response.user);
            this.router.navigate(['/home']);
          });
        },
        err => console.error(err)
        );
    });
  }
  
}
