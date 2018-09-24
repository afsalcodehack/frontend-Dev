import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = '';
  items: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public deviceStatus: DeviceProvider) {
    this.initializeItems();
  }

  initializeItems() {
    // Use a provider here to obtain data.
    this.items = [
      'Apple',
      'Grapes',
      'Mango',
      'Pineapple',
      'Strawberries',
      'Raspberries',
      'Tomato',
      'Watermelon',
    ];
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
