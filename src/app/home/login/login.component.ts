import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sj-login',
  templateUrl: 'login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  withStrava() {
    console.log('strava');
    console.log('https://www.strava.com/oauth/authorize?client_id=22846&response_type=code&redirect_uri=https://soccerjoin.herokuapp.com/login/strava&scope=view_private&state=login&approval_prompt=auto');
    
  }

}
