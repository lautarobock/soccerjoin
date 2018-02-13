import { Component, OnInit, Input } from '@angular/core';
import { Match } from '../../../domain/model';

@Component({
  selector: 'sj-match-chart',
  templateUrl: './match-chart.component.html',
  styles: []
})
export class MatchChartComponent implements OnInit {

  @Input() matches: Match[];
  chartLabels = ['Moving time', 'Elapsed time', 'PPM', 'Distance', 'Avg Speed', 'Calories'];
  chartOptions = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          // console.log(tooltipItem, data);
          // return 'LALALAL';
          switch (tooltipItem.index) {
            case 0:
              return `${Math.round(this.matches[tooltipItem.datasetIndex].movingTime / 60)} min`;
            case 1:
              return `${Math.round(this.matches[tooltipItem.datasetIndex].elapsedTime / 60)} min`;
            case 2:
              return `${Math.round(this.matches[tooltipItem.datasetIndex].averageHeartRate)} ppm`;
            case 3:
              return `${(this.matches[tooltipItem.datasetIndex].distance / 1000).toFixed(2)} Km`;
            case 4:
              return `${this.matches[tooltipItem.datasetIndex].averageSpeed.toFixed(2)} Km/h`;
            case 5:
              return `${Math.round(this.matches[tooltipItem.datasetIndex].calories)} kcal`;
          }
        }
      }
    }
  };
  
  constructor() { }

  ngOnInit() {

  }

  get chartData(): { data: number[], label: string }[] {
    return this.matches.map(match => ({
      data: [
        match.movingTime / 60 / 60 * 100,
        match.elapsedTime / 60 / 60 * 100,
        match.averageHeartRate / 200 * 100,
        match.distance / 1000 / 5 * 100,
        match.averageSpeed / 3 * 100,
        match.calories / 500 * 100
      ],
      label: match.owner.name
    }));
  }

}
