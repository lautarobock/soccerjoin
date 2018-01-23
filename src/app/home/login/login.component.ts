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
    if (localStorage.getItem('strava_token')) {
      this.router.navigate(['login/strava']);
    }
  }

  withStrava() {
    console.log('strava');
    console.log('https://www.strava.com/oauth/authorize?client_id=22846&response_type=code&redirect_uri=https://soccerjoin.herokuapp.com/login/strava&scope=view_private&state=login&approval_prompt=auto');    
  }

}
