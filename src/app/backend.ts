import { backendUrl } from '../global'

import { EndPoint, Backend } from '../models/backend'
import { handlePayment } from './backends/fakePayment';
import { products } from './backends/fakeProducts';
import { handleRegistration, handleLogin } from './backends/fakeUserAuth';

const wikiUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/";

const album = {
  images: [
    { createdAt: new Date(1537684843000), url: `${wikiUrl}0/04/Crater_Mountain_Panarama.jpg/640px-Crater_Mountain_Panarama.jpg` },
    { createdAt: new Date(1537684843000), url: `${wikiUrl}8/8d/Freudenberg_sg_Switzerland.jpg/640px-Freudenberg_sg_Switzerland.jpg` },
    { createdAt: new Date(1506151739000), url: `${wikiUrl}3/3b/BrockenSnowedTreesInSun.jpg/640px-BrockenSnowedTreesInSun.jpg` },
    { createdAt: new Date(1506151739000), url: `${wikiUrl}0/0e/Salar_de_Atacama.jpg/640px-Salar_de_Atacama.jpg` },
    { createdAt: new Date(1537684843000), url: `${wikiUrl}f/f5/Desert_View_Indian_Wells.jpg/640px-Desert_View_Indian_Wells.jpg` },
    { createdAt: new Date(1506151739000), url: `${wikiUrl}b/b5/GothafossWinter.jpg/640px-GothafossWinter.jpg` },
    { createdAt: new Date(1506151739000), url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Ile-de-Re_vue_du_ciel.JPG' },
  ],
};

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
    new EndPoint('image-upload', true, (req) => ({ url: req.body.src })),
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
        });
      }
    }),
    // product
    new EndPoint('products', false, products),
    // stripe
    new EndPoint('payment', false, {}, handlePayment),
  ]
)
