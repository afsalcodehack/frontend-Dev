import { Storage } from '@ionic/storage';
import { ENV } from '../config/environment';

let API_HOST;
if (ENV.API_URL.length > 0) {
  if (ENV.API_URL[0] === '/') {
    // relative url -> full url
    API_HOST = new URL(window.location.protocol + '//' + window.location.host + ENV.API_URL);
  } else {
    API_HOST = new URL(ENV.API_URL);
  }
} else {
  API_HOST = '';
}

export const authHttpServiceFactory = (storage: Storage) => {
  return {
    authScheme: 'JWT ',
    whitelistedDomains: [API_HOST, /localhost(?:$|:\d+)/],
    tokenGetter: () => storage.get('token'),
  };
};
