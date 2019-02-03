import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { logoutWithNetlify, netlifyCurrentUser } from '../../app/app.component';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public up: UserProvider) {
  }

  ionViewDidLoad() {
    if (netlifyCurrentUser()) {
      logoutWithNetlify();
      this.navCtrl.setRoot('root');
    } else if (this.up.logout()) {
      this.navCtrl.setRoot('root');
    }
  }
}
