import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';

@PageTrack()
@Component({
  selector: 'page-verify-email',
  templateUrl: 'verifyemail.html',
})
export class VerifyemailPage {
  loading = true;

  constructor(
    public alertCtrl: I18nAlertProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public up: UserProvider,
  ) {
  }

  ionViewDidLoad() {
    this.up.verifyEmail({ key: this.navParams.get('key') })
      .then((req) => {
        this.loading = false;
        this.navCtrl.setRoot(LoginPage, { message: 'Email Verified Successfully!' });
      }).catch((res) => {
        this.loading = false;
        this.showAlert(res);
      });
  }

  async showAlert(error) {
    let alertText = '';
    switch (error.status) {
      case 404:
        alertText = 'Invalid key. Please try again.';
        break;
      case 400:
        alertText = 'Email already verified.';
        break;
      default:
        alertText = error.message;
    }

    const alert = await this.alertCtrl.create({
      title: 'Verification Failed',
      subTitle: alertText,
      buttons: [{
        text: 'OK',
        handler: (data) => {
          this.navCtrl.setRoot(LoginPage, { message: 'Please login to continue' });
        },
      }],
    });
    alert.present();
  }
}
