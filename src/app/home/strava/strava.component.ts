import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'sj-strava',
  templateUrl: './strava.component.html',
  styles: []
})
export class StravaComponent implements OnInit {

  code: string;
  token: any;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params.code);
      this.code = params.code;
      this.httpClient.post(`https://www.strava.com/oauth/token?client_id=22846&client_secret=c06a0e6204ee08ce943656ff946af4b331aa8f5b&code=${this.code}`, {})
        .subscribe(
          data => {
            console.log(data);
            this.token = data;
          },
          err => console.error(err)
        );
    });
  }

}
