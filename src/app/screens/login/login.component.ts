import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'sj-login',
  templateUrl: 'login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    // if (localStorage.getItem('strava_token')) {
    //   this.router.navigate(['login/strava']);
    // }
  }

}
