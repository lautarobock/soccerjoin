import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../../services/matches.service';
import * as _ from 'lodash';
import { Match } from '../../domain/model';

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

  private readonly dows = ['D', 'M', 'T', 'W', 'T', 'F', 'S']
  lastWeekData;
  lastWeekLabels: any[];
  lastMonthData;
  lastMonthLabels: any[];
  lastQuarter;
  lastHalf;
  lastYear;
  options = {
    // scales: {
    //   xAxes: [{
    //     stacked: true
    //   }],
    //   yAxes: [{
    //     stacked: true
    //   }]
    // }
  };

  constructor(
    private matchesService: MatchesService
  ) { }

  ngOnInit() {
    this.matchesService.myMatches().subscribe(matches => {
      const lastWeekDates = this.lastWeekDates();
      const lastWeekDataSpare = this.buildLastWeekData(matches, lastWeekDates[0]);
      this.lastWeekData = [{
        data: this.completeLastWeekData(lastWeekDates, lastWeekDataSpare, curr => Math.round(curr.movingTime / 60)),
        label: 'Moving time'
      }, {
        data: this.completeLastWeekData(lastWeekDates, lastWeekDataSpare, curr => Math.round((curr.elapsedTime) / 60)),
        label: 'Elapsed time'
      }];
      this.lastWeekLabels = lastWeekDates.map(d => this.dows[new Date(d).getDay()]);

      const lastMonthDates = this.lastMonthDates();
      const lastMonthDataSpare = this.buildLastMonthData(matches, lastMonthDates[0]);
      console.log('lastMonthDataSpare',lastMonthDataSpare)
      this.lastMonthData = [{
        data: this.completeLastMonthData(lastMonthDates, lastMonthDataSpare, curr => Math.round(curr.movingTime / 60)),
        label: 'Moving time'
      }, {
        data: this.completeLastMonthData(lastMonthDates, lastMonthDataSpare, curr => Math.round((curr.elapsedTime) / 60)),
        label: 'Elapsed time'
      }];
      this.lastMonthLabels = lastMonthDates.map(d => {
        const to = new Date(d.getTime());
        to.setDate(to.getDate() + 7);
        return `${d.getMonth()+1}/${d.getDate()} - ${to.getMonth()+1}/${to.getDate()}`;
      });
    });
  }

  private normalizeDay(datetime: Date) {
    let date = new Date(datetime);
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    return date.getTime();
  }

  private normalizeWeek(datetime: Date) {
    let date = new Date(datetime);
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    date.setDate(date.getDate() - date.getDay());
    return date.getTime();
  }

  private completeLastWeekData(lastWeekDates, lastWeekDataSpare, getData: (curr) => number) {
    return lastWeekDates.map(date => {
      let curr = lastWeekDataSpare.find(data => (data.date.getTime() - date.getTime()) === 0);
      if (curr) {
        return getData(curr);
      } else {
        return 0;
      }
    });
  }

  private completeLastMonthData(lastMonthDates, lastMonthDataSpare, getData: (curr) => number) {
    return lastMonthDates.map(date => {
      let curr = lastMonthDataSpare.find(data => (data.date.getTime() - date.getTime()) === 0);
      if (curr) {
        return getData(curr);
      } else {
        return 0;
      }
    });
  }

  private lastWeekDates() {
    let lastWeekLabels = [this.normalizeDay(new Date())];
    for (let i = 0; i < 6; i++) {
      let date = new Date(lastWeekLabels[lastWeekLabels.length - 1]);
      date.setDate(date.getDate() - 1);
      lastWeekLabels.push(date.getTime());
    }
    return lastWeekLabels.reverse().map(d => new Date(d));
  }

  private lastMonthDates() {
    let lastWeekLabels = [this.normalizeWeek(new Date())];
    for (let i = 0; i < 3; i++) {
      let date = new Date(lastWeekLabels[lastWeekLabels.length - 1]);
      date.setDate(date.getDate() - 7);
      lastWeekLabels.push(date.getTime());
    }
    return lastWeekLabels.reverse().map(d => new Date(d));
  }

  private buildLastWeekData(matches: Match[], from: Date) {
    return _.map(
      _.groupBy(
        matches.filter(match => new Date(match.startDate).getTime() >= from.getTime()),
        match => this.normalizeDay(match.startDate)
      ),
      (matches, date) => {
        return {
          date: new Date(parseInt(date)),
          dow: new Date(parseInt(date)).getDay(),
          elapsedTime: _.sumBy(matches, match => match.elapsedTime),
          movingTime: _.sumBy(matches, match => match.movingTime),
          calories: _.sumBy(matches, match => match.calories)
        };
      }
    ).sort((r1, r2) => r1.date.getTime() - r2.date.getTime());
  }

  private buildLastMonthData(matches: Match[], from: Date) {
    return _.map(
      _.groupBy(
        matches.filter(match => new Date(match.startDate).getTime() >= from.getTime()),
        match => this.normalizeWeek(match.startDate)
      ),
      (matches, date) => {
        return {
          date: new Date(parseInt(date)),
          dow: new Date(parseInt(date)).getDay(),
          elapsedTime: _.sumBy(matches, match => match.elapsedTime),
          movingTime: _.sumBy(matches, match => match.movingTime)
        };
      }
    ).sort((r1, r2) => r1.date.getTime() - r2.date.getTime());
  }
}
