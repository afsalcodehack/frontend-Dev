import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public up: UserProvider) {
  }

  ionViewDidLoad() {

    if (this.up.logout()) {
      this.navCtrl.setRoot('root');
    }
  }
}
