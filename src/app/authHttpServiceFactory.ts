import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

const storage = new Storage({});

export const authHttpServiceFactory = (http: Http) => {
  return new AuthHttp(new AuthConfig({
    tokenName: 'token',
    headerPrefix: 'JWT',
    globalHeaders: [{ Accept: 'application/json', 'Content-Type': 'application/json' }],
    noJwtError: true,
    tokenGetter: (() => storage.get('token').then((token: string) => token)),
  }), http);
};
