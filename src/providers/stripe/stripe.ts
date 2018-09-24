import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backend } from '../../app/backend';

@Injectable()
export class StripeProvider {

  paymentUrl = backend.paths['payment'].toURL();

  constructor(public http: HttpClient) {
  }

  charge(
    productId: string | number,
    email: string,
    token: string,
  ): Promise<any> {
    return this.http.post(
      this.paymentUrl,
      { token, email, product_id: productId },
    ).toPromise();
  }

}
