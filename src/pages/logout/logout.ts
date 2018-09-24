import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public alertCtrl: AlertController, public up: UserProvider) {
  }

  ionViewDidLoad() {

    if(this.up.logout()) {
      this.navCtrl.setRoot(HomePage);
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Logged out Successfully!',
      buttons: [ {
       text: 'OK',
       handler: data => {
        this.navCtrl.setRoot(HomePage);
        }
      }],

    });
    alert.present();
  }
}
