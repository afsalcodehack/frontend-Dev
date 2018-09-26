import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

import { Currency } from '../../models/cur';

import {  CurrencyExchangeProvider } from '../../providers/cur-exchange/cur-exchange';


@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
})
export class ServicePage {
  c: Currency;
  vari;
  constructor(public navCtrl: NavController, private ce: CurrencyExchangeProvider) {
    this.ce.load().subscribe(cur => {
      this.c = cur;
      this.vari = JSON.stringify(this.c);

      console.log(this.c);
    })
  }
}
