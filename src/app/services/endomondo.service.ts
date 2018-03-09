import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Session } from './session.service';

@Injectable()
export class EndomondoService {

  constructor(
    private http: HttpClient,
    private session: Session
  ) { }

  login(email: string, password: string) {
    return this.http.get<EndomondoAuthData>(`${environment.backendUrl}/api/endomondo/auth?email=${email}&password=${password}&action=pair&country=ES&deviceId=soccerjoin`);
  }

  workouts() {
    return this.http.get<EndomondoWorkout[]>(`${environment.backendUrl}/api/endomondo/workout?authToken=${this.session.loggedUser().endomondo.authToken}`);
  }

  workout(id: number) {
    return this.http.get<EndomondoWorkoutDetail>(`${environment.backendUrl}/api/endomondo/workout/${id}?authToken=${this.session.loggedUser().endomondo.authToken}`);
  }

  // account(authToken: string) {
  //   return this.http.get<EndomondoAccount>(`${environment.backendUrl}/api/endomondo/account?authToken=${authToken}`);
  // }
}

export class EndomondoAuthData {
  public action: string;
  public authToken: string;
  public measure: string;
  public displayName: string;
  public userId: number;
  public facebookConnected: boolean;
  public secureToken: string;
}

export class EndomondoWorkout {
  public id: number;
  public name: string;
}

export class EndomondoWorkoutDetail extends EndomondoWorkout {
  public heart_rate_avg: number;
  public distance: number;
  public speed_avg: number;
  public duration: number;
  public heart_rate_max: number;
  public calories: number;
  public start_time: Date;
  public speed_max: number;
  public points: {
    lng: number,
    dist: number,
    hr: number,
    time: Date,
    lat: number
  }[];
}

// export class EndomondoAccount {
//   public picture_ur: string;
//   public weight_kg: number;
//   public height_cm: number;
//   public date_of_birth: Date;
//   public sex: string;
//   public last_name: string;
//   public id: number;
//   public first_name: string;
//   public email: string;
// }
