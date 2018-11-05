import { Storage } from '@ionic/storage';

export const authHttpServiceFactory = (storage: Storage) => {
  return {
    authScheme: 'JWT ',
    tokenGetter: () => storage.get('token'),
  };
};
