import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';
import { ProductProvider } from '../../providers/product/product';
import { PaymentPage } from '../payment/payment';


@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  products = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public deviceStatus: DeviceProvider,
    public productProvider: ProductProvider,
  ) {
  }

  async ionViewDidLoad() {
    this.products = await this.productProvider.getProducts();
  }

  buy(product) {
    this.navCtrl.push(PaymentPage, { product });
  }

}
