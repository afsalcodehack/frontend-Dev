import {
  HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { LanguageProvider } from './language/language';

@Injectable()
export class AcceptLanguageInterceptor implements HttpInterceptor {
  constructor(public injector: Injector) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const langProvider: LanguageProvider = this.injector.get(LanguageProvider);
    return Observable.fromPromise(langProvider.getLanguage()).mergeMap((lang: string) => {
      const newRequest = req.clone({ headers: req.headers.set('Accept-Language', lang) });
      return next.handle(newRequest);
    });
  }
}

export const translationProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AcceptLanguageInterceptor,
  multi: true,
};
