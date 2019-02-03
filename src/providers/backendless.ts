import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/dematerialize';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';

import * as url from 'url';

import { backend } from '../app/backend';
import { backendUrl } from '../global';
import { EndPoint } from '../models/backend';

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

    let fakeData: any = component.fakeData;

    if (typeof fakeData === 'function') {
      console.log(`invoking function to get fake data for ${component.path}`);
      fakeData = fakeData(request);
    }

    console.log(`using fake data for ${component.path} of type ` + typeof fakeData);

    if (! (fakeData instanceof HttpResponse)) {
      fakeData = new HttpResponse({ status: 200, body: fakeData });
    }
    return fakeData;
  }

  getFakeComponent(request): EndPoint | null {
    if (!this.allowFakeResponse) { return null; }

    const parsedUrl = url.parse(request.url);
    if (!parsedUrl.pathname) { return null; }
    let path = parsedUrl.pathname;
    // These two prefixes are proxies for the backend,
    // provided by netlify.toml and ionic.config.json.
    if (path.startsWith('/api/')) {
      path = path.substr(4);
    } else if (path.startsWith('/api-dev/')) {
      path = path.substr(8);
    }
    const component = backend.paths[path];

    if (component === undefined) {
      console.log(`endpoint ${path} is not in app.backend`);
      return null;
    }

    if (!this.preferOffline && component.implemented) {
      console.log(`implemented endpoint ${path} is preferred`);
      return null;
    }

    if (!component.fakeData) {
      console.log(`no fake data for ${path}`);
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
    });
  }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true,
};
