import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductProvider } from '../../providers/product/product';
import { PaymentPage } from '../payment/payment';
import { PageTrack } from '../../decorators/PageTrack';

@PageTrack()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  products = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public productProvider: ProductProvider,
  ) {
  }

  async ionViewDidLoad() {
    this.products = await this.productProvider.getProducts();
  }

  buy(product) {
    this.navCtrl.push(PaymentPage, {
      title: product.name,
      item: {
        type: 'product',
        ...product,
      },
    });
  }

}
