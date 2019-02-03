/* tslint:disable:only-arrow-functions */
import { Events } from 'ionic-angular';

import { AppModule } from '../app/app.module';

export function PageTrack(): ClassDecorator {
  return function (constructor: any) {
    const ionViewDidEnter = constructor.prototype.ionViewDidEnter;

    constructor.prototype.ionViewDidEnter = function (...args: any[]) {
      const injector = AppModule['injector'];
      if (AppModule.gaEnabled && injector) {
        const events = injector.get(Events);
        events.publish('view:enter', this.constructor.name);
        if (ionViewDidEnter) {
          ionViewDidEnter.apply(this, args);
        }
      }
    };
  };
}
