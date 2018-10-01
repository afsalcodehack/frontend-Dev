import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backend } from '../../app/backend';

@Injectable()
export class StripeProvider {

  paymentUrl = backend.paths['payment'].toURL();

  constructor(public http: HttpClient) {
  }

  charge(
    item: { type, id, price, currency },
    email: string,
    token: string,
  ): Promise<any> {
    return this.http.post(this.paymentUrl, {
      token,
      email,
      item_type: item.type,
      item_id: item.id,
      price: item.price,
      currency: item.currency,
    }).toPromise();
  }

}
