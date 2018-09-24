import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backend } from '../../app/backend';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  eventlistUrl = backend.paths['events'].toURL();
  eventUrl = backend.paths['event'].toURL();
  eventcreateUrl = backend.paths['event/create'].toURL();

  constructor(public http: HttpClient) {
  }

  getEvents(): Promise<any> {
    return this.http.get(this.eventlistUrl).toPromise();
  }

  getEvent(id: number | string): Promise<any> {
    return this.http.post(this.eventUrl, { id }).toPromise();
  }

  createEvent(data: any): Promise<any> {
    return this.http.post(this.eventcreateUrl, data).toPromise();
  }

}
