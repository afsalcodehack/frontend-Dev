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
  eventUpdateUrl = backend.paths['event/update'].toURL();
  getAccessTokenUrl = backend.paths['event/access-token'].toURL();
  newSecretKeyUrl = backend.paths['event/secret-key'].toURL();
  searchUrl = backend.paths['event/search'].toURL();

  constructor(public http: HttpClient) {
  }

  getEvents(): Promise<any> {
    return this.http.get(this.eventlistUrl).toPromise();
  }

  getEvent(id: number | string, opts= {}): Promise<any> {
    return this.http.post(this.eventUrl, { id, ...opts }).toPromise();
  }

  createEvent(data: any): Promise<any> {
    return this.http.post(this.eventcreateUrl, data).toPromise();
  }

  updateEvent(data: any): Promise<any> {
    return this.http.post(this.eventUpdateUrl, data).toPromise();
  }

  getAccessToken(id: any, secret: any) {
    return this.http.post(this.getAccessTokenUrl, { id, secret }).toPromise();
  }

  getNewSecretKey(): Promise<any> {
    return this.http.get(this.newSecretKeyUrl).toPromise();
  }

  search(data: any) {
    // TODO: Search should be a get type request
    return this.http.post(this.searchUrl, data).toPromise();
  }
}
