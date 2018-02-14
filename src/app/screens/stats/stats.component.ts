import { Component, OnInit } from '@angular/core';
import { MatchesService } from '../../services/matches.service';
import * as _ from 'lodash';
import { Match } from '../../domain/model';

@Component({
  selector: 'sj-stats',
  templateUrl: './stats.component.html',
  styles: [`
:host div {
  height: calc(100vh - 64px)
}
  `]
})
export class StatsComponent implements OnInit {

  options = {
    responsive: true,
    maintainAspectRatio: false
    // scales: {
    //   xAxes: [{
    //     stacked: true
    //   }],
    //   yAxes: [{
    //     stacked: true
    //   }]
    // }
  };
  charts: ChartData[];

  constructor(
    private matchesService: MatchesService
  ) { }

  ngOnInit() {
    this.matchesService.myMatches().subscribe(matches => {
      this.charts = [
        new WeekChartData(matches),
        new MonthChartData(matches),
        new QuarterChartData(matches),
        new YearChartData(matches)
      ];
    });
  }

}

export abstract class ChartData {

  data: any[];
  labels: any[];

  constructor(matches: Match[], amount: number, span: number, public title: string) {
    const lastWeekDates = this.generateDates(amount, span);
    const lastWeekDataSparse = this.buildData(matches, lastWeekDates[0]);
    this.data = this.generateSeries(lastWeekDates, lastWeekDataSparse);
    this.labels = lastWeekDates.map(d => this.buildLabel(d));
  }

  protected abstract normalizeDate(datetime: Date): number;
  protected abstract buildLabel(date: Date): string;

  private completeData(dates, sparseData, getData: (curr) => number) {
    return dates.map(date => {
      let curr = sparseData.find(data => (data.date.getTime() - date.getTime()) === 0);
      if (curr) {
        return getData(curr);
      } else {
        return 0;
      }
    });
  }

  protected generateDates(amount: number, span: number) {
    let dates = [this.normalizeDate(new Date())];
    for (let i = 0; i < (amount - 1); i++) {
      let date = new Date(dates[dates.length - 1]);
      date.setDate(date.getDate() - span);
      dates.push(date.getTime());
    }
    return dates.reverse().map(d => new Date(d));
  }

  protected buildData(matches: Match[], from: Date) {
    return _.map(
      _.groupBy(
        matches.filter(match => new Date(match.startDate).getTime() >= from.getTime()),
        match => this.normalizeDate(match.startDate)
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

  protected generateSeries(dates, sparseData) {
    return [{
      data: this.completeData(dates, sparseData, curr => Math.round(curr.movingTime / 60)),
      label: 'Moving time'
    }, {
      data: this.completeData(dates, sparseData, curr => Math.round((curr.elapsedTime) / 60)),
      label: 'Elapsed time'
    }];
  }
}

export class WeekChartData extends ChartData {

  private static readonly  dows = ['D', 'M', 'T', 'W', 'T', 'F', 'S']

  constructor(matches: Match[]) {
    super(matches, 7, 1, 'Week');
  }

  protected normalizeDate(datetime: Date) {
    let date = new Date(datetime);
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    return date.getTime();
  }

  protected buildLabel(date: Date): string {
    return WeekChartData.dows[new Date(date).getDay()];
  }

}

export class MonthChartData extends ChartData {

  constructor(matches: Match[]) {
    super(matches, 4, 7, 'Month');
  }

  protected normalizeDate(datetime: Date) {
    let date = new Date(datetime);
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    date.setDate(date.getDate() - date.getDay());
    return date.getTime();
  }

  protected buildLabel(date: Date): string {
    const to = new Date(date.getTime());
    to.setDate(to.getDate() + 7);
    return `${date.getMonth() + 1}/${date.getDate()} - ${to.getMonth() + 1}/${to.getDate()}`;
  }

}

export class QuarterChartData extends ChartData {

  constructor(matches: Match[]) {
    super(matches, 4 * 3, 7, 'Qarter');
  }

  protected normalizeDate(datetime: Date) {
    let date = new Date(datetime);
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    date.setDate(date.getDate() - date.getDay());
    return date.getTime();
  }

  protected buildLabel(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

}

export class YearChartData extends ChartData {

  private static readonly months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

  constructor(matches: Match[]) {
    super(matches, 12, 30, 'Year');
  }

  // overrides fixing rounded months
  protected generateDates(amount: number, span: number) {
    let dates = [this.normalizeDate(new Date())];
    for (let i = 0; i < (amount - 1); i++) {
      let date = new Date(dates[dates.length - 1]);
      date.setMonth(date.getMonth() - 1);
      dates.push(date.getTime());
    }
    return dates.reverse().map(d => new Date(d));
  }

  protected normalizeDate(datetime: Date) {
    let date = new Date(datetime);
    date.setHours(0); date.setMinutes(0); date.setSeconds(0); date.setMilliseconds(0);
    date.setDate(1);
    return date.getTime();
  }

  protected buildLabel(date: Date): string {
    return YearChartData.months[date.getMonth()];
  }

}
