export class User {
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