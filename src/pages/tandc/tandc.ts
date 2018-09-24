import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';


@Component({
  selector: 'page-tandc',
  templateUrl: 'tandc.html',
})
export class TandcPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public deviceStatus: DeviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TandcPage');
  }

}
