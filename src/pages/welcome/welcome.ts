import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';


@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public deviceStatus: DeviceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

}
