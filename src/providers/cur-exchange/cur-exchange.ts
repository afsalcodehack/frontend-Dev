import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { CacheService } from "ionic-cache";

import { Currency } from '../../models/cur';

@Injectable()
export class CurrencyExchangeProvider {
  ceUrl = 'https://api.fixer.io/latest';

  constructor(public http: Http, private cache: CacheService) { }

  load(): Observable<Currency> {
    let request = this.http.get(this.ceUrl);
    let cacheKey = this.ceUrl;
    return this.cache.loadFromObservable(cacheKey, request).map(res => <Currency>res.json());
  }
}
