import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sj-stats',
  templateUrl: './stats.component.html',
  styles: [`
:host p {
  height: 100vh
}
  `]
})
export class StatsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
