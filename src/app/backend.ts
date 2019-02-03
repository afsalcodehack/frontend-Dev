import { appTitle, backendUrl } from '../global';

import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export const backendEvent = new Subject<{ name: string, data?: any }>();
export const backendEventListener = (name: string) => backendEvent.asObservable().pipe(
  filter((payload) => payload.name === name),
  map((payload) => payload.data),
);

import { Backend, EndPoint } from '../models/backend';
import { bookings, getOrderFromId, orders, toPayableOrder, updateOrderItemStatus } from './backends/fakeBookings';
import { categories } from './backends/fakeCategories';
import { album, events, forkAndCleanEvent } from './backends/fakeEvents';
import { handlePayment } from './backends/fakePayment';
import { pickups } from './backends/fakePickups';
import { products } from './backends/fakeProducts';
import { services } from './backends/fakeServices';
import { handleGetUserInfo, handleLogin, handleRegistration } from './backends/fakeUserAuth';
import { looseMatch, matchId } from './utils';

import { isInsideBounds } from './backends/map.functions';

export const backend = new Backend(
  backendUrl,
  [
    new EndPoint('get-user-info', true, handleGetUserInfo),
    new EndPoint('api-token-oauth', true),
    new EndPoint('auth/convert-token', true),
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
    new EndPoint('events', true, () => {
      return events.map((event) => forkAndCleanEvent(event));
    }),
    new EndPoint('event', true, (req) => {
      let event = events.find(matchId(req.body.id));
      event = forkAndCleanEvent(event);
      return { album, ...event };
    }),
    new EndPoint('event/create', true, {}, (req) => {
      const newEvent = req.body;
      events.push({ id: Date.now(), ...newEvent });
    }),
    new EndPoint('event/update', true, (req) => {
      if (req.body['info']) {
        const event = events.find(matchId(req.body.info.id)) || {};
        const info = req.body.info;

        if (!info.isPublic) {
          if (event['secret']) {
            if (!info.secret) {
              delete info.secret;
            }
          } else {
            if (!info.secret) {
              info.isPublic = true;
            }
          }
        }

        if (info.isPublic) {
          info.secret = '';
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
    new EndPoint('event/access-token', true, (req) => {
      const event = events.find(matchId(req.body.id)) || {};
      const secret = event['secret'];

      if (!secret) {
        return { ok: true, token: -1 };
      }

      if (req.body.secret === secret) {
        return { ok: true, token: '123456789' };
      }

      return { ok: false };
    }),
    // pickup
    new EndPoint('pickups', false, pickups),
    new EndPoint('pickup', false, (req) => {
      const pickup = pickups.find(matchId(req.body.id));
      return pickup;
    }),
    // product
    new EndPoint('products', false, products),
    new EndPoint('product', false, (req) => {
      const product = products.find(matchId(req.body.id));
      return { album, ...product };
    }),
    // booking
    new EndPoint('bookings', false, bookings),
    new EndPoint('booking', false, (req) => {
      const booking = bookings.find(matchId(req.body.id));
      return booking;
    }),
    new EndPoint('booking/timeslots', false, (req) => {
      const locationId = req.body.locationId;
      const boardType = req.body.boardType;
      const booking = bookings.find(matchId(locationId));
      if (booking) {
        const board = booking.boards.find((b) => b.name === boardType);
        let boardQuantity = 0;
        if (board) {
          boardQuantity = board.number;
        }
        return booking.timeslots.map((timeslot) => {
          let orderQuantity = 0;
          orders.forEach((order) => {
            if (order.locationId === locationId) {
              order.orderItems.forEach((item) => {
                if (item.boardType === boardType &&
                  item.timeslot.startTime === timeslot.startTime &&
                  item.timeslot.endTime === timeslot.endTime) {
                    orderQuantity++;
                  }
              });
            }
          });
          if (boardQuantity > orderQuantity) {
            return {
              ...timeslot,
              amount: boardQuantity - orderQuantity,
            };
          } else {
            return null;
          }
        }).filter((timeslot) => timeslot);
      } else {
        return [];
      }
    }),
    new EndPoint('order', false, (req) => {
      const { orderId, productId, status } = req.body;
      updateOrderItemStatus(orderId, productId, status);
    }),
    new EndPoint('orders', false, (req) => getOrderFromId(req.params.get('orderId'))),
    new EndPoint('orders/location', false, (req) => {
      return orders.filter((order) => looseMatch(order.locationId, req.body.locationId));
    }),
    new EndPoint('order/to-payable', false, (booking) => {
      return toPayableOrder(booking.body);
    }),
    new EndPoint('order/register-payment', false, () => {
      const base = Math.random() * 10000000;
      return { bookingId: parseInt(base.toString(), 10) };
    }),

    // stripe
    new EndPoint('payment', false, {}, handlePayment),
    // localizzer services
    // Expects latNE, lngNE, latSW, and lngSW as query parameters
    // Returns all services in the bounds described by the two corners
    new EndPoint('map-pins', false, (req) => {
      console.log('map-pins', req);

      const params = req.params.map;
      const northEast = {
        lat: params.get('latNE')[0],
        lng: params.get('lngNE')[0],
      };
      const southWest = {
        lat: params.get('latSW')[0],
        lng: params.get('lngSW')[0],
      };

      return services.filter((service) => {
        return isInsideBounds(service.location, northEast, southWest);
      });
    }),
    new EndPoint('get-categories', false, (req) => {
      return categories;
    }),
    new EndPoint('email-invite', false, (req) => {
      return { status : 'success' };
    }),
  ],
);
