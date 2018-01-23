import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'home',
  template: `<sj-login></sj-login>
  <sj-footer></sj-footer>`
})
export class HomeComponent implements OnInit {
  // public message: string;

  constructor() {}

  ngOnInit() {
    // this.httpClient.get('/api/test').subscribe(res => this.message = JSON.stringify(res));
    // this.message = 'Hello';
  }
}