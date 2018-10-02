import { backendUrl, appTitle } from '../global'

import { Subject } from "rxjs";
import { filter, map } from "rxjs/operators";

export const backendEvent = new Subject<{name: string, data?: any }>();
export const backendEventListener = (name: string) => backendEvent.asObservable().pipe(
  filter((payload) => payload.name === name),
  map((payload) => payload.data),
);

import { EndPoint, Backend } from '../models/backend'
import { handlePayment } from './backends/fakePayment';
import { products } from './backends/fakeProducts';
import { handleRegistration, handleLogin } from './backends/fakeUserAuth';
import { events, album } from './backends/fakeEvents';

export const backend = new Backend(
  backendUrl,
  [
    new EndPoint('get-user-info', true, {'token': 'fake token'}),
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
    new EndPoint('events', false, () =>
      events.filter(event => event.isPublic)
    ),
    new EndPoint('event', false, (req) => {
      return { album, ...events.find(event => event.id === req.body.id) };
    }),
    new EndPoint('event/create', false, {}, (req) => {
      const newEvent = req.body;
      events.push({ id: Date.now(), ...newEvent });
    }),
    new EndPoint('event/update', false, (req) => {
      if (req.body['url']) {
        album.images.push({
          createdAt: new Date(),
          url: req.body.url,
          addWatermark: appTitle,
        });
      }
    }),
    // product
    new EndPoint('products', false, products),
    // stripe
    new EndPoint('payment', false, {}, handlePayment),
  ]
)
