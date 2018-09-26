import { backendUrl } from '../global'

import { EndPoint, Backend } from '../models/backend'
import { handlePayment } from './backends/fakePayment';
import { products } from './backends/fakeProducts';
import { handleRegistration, handleLogin } from './backends/fakeUserAuth';

const events = [
  { id: 1, name: 'CEBIT', isPublic: true, },
  { id: 2, name: 'PyCon', isPublic: true, },
  { id: 3, name: 'B2BNord', isPublic: true, },
  { id: 4, name: 'TechCrunch', isPublic: false, },
];

export const backend = new Backend(
  backendUrl,
  [
    new EndPoint('get-user-info', true, {'token': 'fake token'}),
    new EndPoint('update-user-info', true),
    new EndPoint('image-upload', true),
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
    new EndPoint('event', false, (req) =>
      events.find(event => event.id === req.body.id)
    ),
    new EndPoint('event/create', false, {}, (req) => {
      const newEvent = req.body;
      events.push({ id: Date.now(), ...newEvent });
    }),
    // product
    new EndPoint('products', false, products),
    // stripe
    new EndPoint('payment', false, {}, handlePayment),
  ]
)
