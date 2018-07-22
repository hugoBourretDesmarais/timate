import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class CommunicationService {

    // ipAddress = 'http://' + window.location.hostname;
    // port = '8081';
    // url = this.ipAddress + ':' + this.port;
    url = "https://selfish-catfish-3.localtunnel.me";

    public devices : Device[] = [];
    public numberOfPeopleAtEachHours = [];

    constructor(private http: HttpClient) { }

    public getNumberOfPeopleAtEachHours(day){
        console.log("getNumberOfPeopleAtEachHours");
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

    public getDevices() {
        console.log("getDevices");

        this.http.get(this.url + "/devices").subscribe(
            data => {
                this.devices = data as Device[];
                return this.devices;
            },
            err => {
              console.log("Error occured.")
              return null;
            }
          );
    }
}