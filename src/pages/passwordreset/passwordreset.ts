import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';
import { UserProvider } from '../../providers/user/user';

@PageTrack()
@Component({
  selector: 'page-passwordreset',
  templateUrl: 'passwordreset.html',
})
export class PasswordresetPage {

  private passwordresetForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public alertCtrl: I18nAlertProvider,
    public fb: FormBuilder,
  ) {
    this.passwordresetForm = this.fb.group({
      email: ['', Validators.required],
    });
  }

  resetPasswordInitiate() {
    const data = this.passwordresetForm.value;
    this.up.resetPasswordInitiate(data)
      .then(() => {
        this.showAlert();
      }, (error) => {
        console.log(error);
      });
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      title: 'Reset Initiated',
      subTitle: 'Password reset e-mail has been sent.',
      buttons: [{
        text: 'OK',
        handler: (data) => {
          this.navCtrl.setRoot('root');
        },
      }],
    });
    alert.present();
  }

}
