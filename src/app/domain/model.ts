export class User {
    public _id: string;
    public name: string;
    public lastName: string;
    public sex: string;
    public pictureUrl: string;
    public email: string;
    public city: string;
    public state: string;
    public country: string;
    public preferences: {
        dateFormat: string;
        measurement: string
    };
    public strava: {
        id: number;
        access_token: string
    }
}

export class LoginResponse {
    public token: string;
    public exp: number;
    public user: User;
}

export class Match {
    public _id: string;
    public name;
    public strava: {
        id: number;
        external_id: string
    };
    public distance: number;
    public movingTime: number;
    public elapsedTime: number;
    public startDate: Date;
    public averageSpeed: number;
    public maxSpeed: number;
    public averageHeartRate: number;
    public maxHeartRate: number;
    public calories: number;
    public center: Point;
    public streams: {
        time: number[],
        distance: number[],
        heartRate: number[],
        latlng: Point[]
    }
    public owner: User;
    public likes: Like[];
    public join: Join;
}

export class Like {
    date: Date;
    name: string;
    pictureUrl: string;
    owner: User | string;
}

export class Point {
    public lat: number;
    public lng: number;
}

export class Join {
    public matches: (Match | string)[]
}