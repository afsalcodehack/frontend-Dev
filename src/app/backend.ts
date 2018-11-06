import { appTitle, backendUrl } from '../global';

import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const backendEvent = new Subject<{name: string, data?: any }>();
export const backendEventListener = (name: string) => backendEvent.asObservable().pipe(
  filter((payload) => payload.name === name),
  map((payload) => payload.data),
);

import { Backend, EndPoint } from '../models/backend';
import { album, events, forkAndCleanEvent, generateSecretKey } from './backends/fakeEvents';
import { handlePayment } from './backends/fakePayment';
import { products } from './backends/fakeProducts';
import { handleLogin, handleRegistration } from './backends/fakeUserAuth';

export const backend = new Backend(
  backendUrl,
  [
    new EndPoint('get-user-info', true, { token: 'fake token' }),
    new EndPoint('update-user-info', true),
    new EndPoint('image-upload', false, (req) => ({ url: req.body.src })),
    // rest-auth
    new EndPoint('rest-auth/registration', true, handleRegistration),
    new EndPoint('rest-auth/login', true, handleLogin),
    new EndPoint('rest-auth/password/reset', true),
    new EndPoint('rest-auth/password/reset/confirm', true),
    new EndPoint('rest-auth/password/change', true),
    new EndPoint('rest-auth/registration/account-confirm-email', true),
    // event
    new EndPoint('events', false, () => {
      return events.map((event) => forkAndCleanEvent(event));
    }),
    new EndPoint('event', false, (req) => {
      let event = events.find((el) => el.id === req.body.id);
      if (!event) {
        return {
          ok: false,
          result: null,
        };
      }

      event = forkAndCleanEvent(event);
      return {
        ok: true,
        result: { album, ...event },
      };
    }),
    new EndPoint('event/create', false, {}, (req) => {
      const newEvent = req.body;
      events.push({ id: Date.now(), ...newEvent });
    }),
    new EndPoint('event/update', false, (req) => {
      if (req.body['info']) {
        const event = events.find((el) => el.id === req.body.info.id) || {};
        const info = req.body.info;

        if (info.isPublic) {
          info.secret = null;
        }

        if (!info.secret && !info.isPublic) {
          info.isPublic = true;
        }

        Object.assign(event, info);
      }

      if (req.body['url']) {
        album.images.push({
          createdAt: new Date(),
          fullResUrl: req.body.url,
          thumbUrl: req.body.url,
          addWatermark: appTitle,
          purchased: false,
        });
      }
    }),
    new EndPoint('event/access-token', false, (req) => {
      const event = events.find((el) => el.id === req.body.id) || {};
      const secret = event['secret'];

      if (!secret) {
        return { ok: true, token: -1 };
      }

      if (req.body.secret === secret) {
        return { ok: true, token: '123456789' };
      }

      return { ok: false };
    }),
    new EndPoint('event/secret-key', false, (req) => {
      return { ok: true, result: generateSecretKey() };
    }),
    new EndPoint('event/search', false, (req) => {
      const secret = req.body['secret'];

      if (secret) {
        return {
          ok: true,
          result: events
            .filter((event) => event['secret'] === secret)
            .map((event) => event.id),
        };
      }

      return { ok: false, result: null };
    }),
    // product
    new EndPoint('products', false, products),
    // stripe
    new EndPoint('payment', false, {}, handlePayment),
  ],
);
