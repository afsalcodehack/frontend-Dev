import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, public deviceStatus: DeviceProvider) {

  }

}
