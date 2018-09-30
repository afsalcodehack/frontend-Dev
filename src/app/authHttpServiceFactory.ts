import { Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Storage } from '@ionic/storage';

let storage = new Storage({});

export function authHttpServiceFactory(http: Http) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token',
    headerPrefix: 'JWT',
    globalHeaders: [{'Accept': 'application/json', 'Content-Type':'application/json'}],
    noJwtError: true,
    tokenGetter: (() => storage.get('token').then((token: string) => token)),
  }), http);
}
