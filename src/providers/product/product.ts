import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backend } from '../../app/backend';

@Injectable()
export class ProductProvider {

  productDetailUrl = backend.paths['product'].toURL();
  productListUrl = backend.paths['products'].toURL();

  constructor(public http: HttpClient) {
  }

  getProducts(): Promise<any> {
    return this.http.get(this.productListUrl).toPromise();
  }

  getProduct(id: number | string, opts= {}): Promise<any> {
    return this.http.post(this.productDetailUrl, { id, ...opts }).toPromise();
  }

}
