import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backend } from '../../app/backend';

@Injectable()
export class ProductProvider {

  productlistUrl = backend.paths['products'].toURL();

  constructor(public http: HttpClient) {
  }

  getProducts(): Promise<any> {
    return this.http.get(this.productlistUrl).toPromise();
  }

}
