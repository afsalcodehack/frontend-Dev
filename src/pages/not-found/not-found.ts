import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';


@Component({
  selector: 'page-not-found',
  templateUrl: 'not-found.html',
})
export class NotFoundPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public deviceStatus: DeviceProvider) {
  }
}
