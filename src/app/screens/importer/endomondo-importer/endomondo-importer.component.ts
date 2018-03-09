import { Component, OnInit } from '@angular/core';
import { EndomondoService, EndomondoWorkout, EndomondoWorkoutDetail } from '../../../services/endomondo.service';
import { GeoService } from '../../../services/geo.service';
import { MatchesService } from '../../../services/matches.service';
import { Match } from '../../../domain/model';
import { Router } from '@angular/router';
declare var google: any;

@Component({
  selector: 'sj-endomondo-importer',
  templateUrl: './endomondo-importer.component.html',
  styles: [`
agm-map {
  height: 350px;
}
  `]
})
export class EndomondoImporterComponent implements OnInit {

  workouts: EndomondoWorkout[];
  selected: EndomondoWorkout;
  workout: EndomondoWorkoutDetail;
  lat: number;
  lng: number;
  heatmap: any;
  zoom = 22;

  constructor(
    private endomondoService: EndomondoService,
    private geoService: GeoService,
    private matchesService: MatchesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.endomondoService.workouts().subscribe(data => this.workouts = data);
  }

  mapReady(map) {
    this.heatmap = new google.maps.visualization.HeatmapLayer({ map });
    this.geoService.last().then(coordinates => {
      this.lat = coordinates.latitude;
      this.lng = coordinates.longitude;
    })
  }

  showInfo(selected: EndomondoWorkout) {
    this.endomondoService.workout(this.selected.id).subscribe(data => {
      this.workout = data;
      this.heatmap.setData(data.points.map(point => new google.maps.LatLng(point.lat, point.lng)));
      const point = data.points.reduce((prev, current) => {
        return {
          lat: prev.lat + current.lat,
          lng: prev.lng + current.lng
        } as any;
      });
      this.lat = point.lat / data.points.length;
      this.lng = point.lng / data.points.length;
    });
  }

  import() {
    if (!this.workout.name) {
      this.workout.name = prompt('Name is required field')
    }
    this.matchesService.create({
      name: this.workout.name,
      endomondo: {
        id: this.workout.id
      },
      averageHeartRate: this.workout.heart_rate_avg,
      distance: this.workout.distance * 1000,
      elapsedTime: this.workout.duration,
      startDate: this.workout.start_time,
      averageSpeed: this.workout.speed_avg,
      maxSpeed: this.workout.speed_max,
      maxHeartRate: this.workout.heart_rate_max,
      calories: this.workout.calories,
      center: {
        lat: this.lat,
        lng: this.lng
      },
      streams: {
        time: this.relativeTimes(),
        distance: this.workout.points.map(p => p.dist),
        heartRate: this.workout.points.map(p => p.hr),
        latlng: this.workout.points.map(p => ({lat: p.lat, lng: p.lng}))
      },
      owner: undefined
    } as Match).subscribe(
      response => this.router.navigate(['/matches', response._id]),
      err => console.error(err)
    )
  }

  private relativeTimes() {
    const start = new Date(this.workout.start_time).getTime() / 1000;
    return this.workout.points.map(p => new Date(p.time).getTime() / 1000 - start);
  }

}
