// tslint:disable-next-line:ordered-imports
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {

    let newRequest =  request.clone({
        headers: request.headers,
    });
    console.log('path : ' + request.url);
    if (request.method === 'POST') {
        console.log('post');
        if(localStorage.getItem('token')) {
            newRequest = request.clone({
                headers: request.headers.set('Authorization', 'JWT ' + localStorage.getItem('token')),
              });
        }
    } else {
        if (localStorage.getItem('token')) {
        newRequest = request.clone({
        headers: request.headers.set('Authorization', 'JWT ' + localStorage.getItem('token')),
      });
    }
    }

    return next.handle(newRequest).pipe(
      map((event: HttpEvent < any > ) => {
        if (event instanceof HttpResponse) {
          if (event.status === 401) {
            alert('invalid token');
          }
        }
        return event;
      }),
    )
  }

}