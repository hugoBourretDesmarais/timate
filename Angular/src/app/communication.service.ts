import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class CommunicationService {

    // ipAddress = 'http://' + window.location.hostname;
    // port = '8081';
    // url = this.ipAddress + ':' + this.port;
    url = "https://horrible-baboon-39.localtunnel.me";

    constructor(private http: Http) { }

    public getNumberOfPeopleAtEachHours(day = 0){
        return this.http.get(this.url + '/numberOfPeopleAtEachHours', {
            params: {
                day: day,
            }
        }).map((response: Response) => {
            if (response.status === 200) {
                this.numberOfPeopleAtEachHours = response.json();
                console.log(this.numberOfPeopleAtEachHours);
                return true;
            }
            return false;
        });
    }

    numberOfPeopleAtEachHours = [];

}