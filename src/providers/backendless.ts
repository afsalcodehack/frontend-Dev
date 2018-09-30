import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import 'rxjs/add/operator/do';

import * as url from 'url';

import { EndPoint } from '../models/backend'
import { backend } from '../app/backend'
import { backendUrl } from '../global';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  // manually change this to true to switch to offline fake data
  allowFakeResponse = true;
  // only if fake responses are allowed above, select whether
  // fake data is preferred even if the component is implemented.
  // disable this to use the real backend together with the fake data.
  // currently, we enable preferOffline mode only if environment is
  // switched to offline mode, where backendUrl is empty.
  preferOffline = !backendUrl;

  getFakeResponse(request, component) {
    // Need to check request.method if the same end point supports
    // multiple methods.

    let fakeData : any = component.fakeData;

    if (typeof fakeData == 'function') {
      console.log(`invoking function to get fake data for ${component.path}`);
      fakeData = fakeData(request);
    }

    console.log(`using fake data for ${component.path} of type ` + typeof fakeData);

    if (! (fakeData instanceof HttpResponse)) {
      fakeData = new HttpResponse({ status: 200, body: fakeData })
    }
    return fakeData;
  }

  getFakeComponent(request) : EndPoint | null {
    if (!this.allowFakeResponse) return null;

    let parsedUrl = url.parse(request.url);
    if (!parsedUrl.pathname) return null;
    let component = backend.paths[parsedUrl.pathname];

    if (component === undefined) {
      console.log(`endpoint ${parsedUrl.pathname} is not in app.backend`);
      return null;
    }

    if (!this.preferOffline && component.implemented) {
      console.log(`implemented endpoint ${parsedUrl.pathname} is preferred`);
      return null;
    }

    if (!component.fakeData) {
      console.log(`no fake data for ${parsedUrl.pathname}`);
      return null;
    }

    return component;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // wrap in delayed observable to simulate server api call
    return Observable.of(null).mergeMap(() => {
      const component = this.getFakeComponent(request);

      if (component) {
        const response = this.getFakeResponse(request, component);
        return Observable.of(response)
          .delay(500)
          .do(() => {
            if (component.done) {
              component.done(request, response);
            }
          });
      } else {

        // pass through any requests not handled above
        return next.handle(request);
      }
    })
  }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
