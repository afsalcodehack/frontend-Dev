import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';

@PageTrack()
@Component({
  selector: 'page-passwordresetconfirm',
  templateUrl: 'passwordresetconfirm.html',
})
export class PasswordresetconfirmPage {

  private passwordresetconfirmForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public alertCtrl: I18nAlertProvider,
    public fb: FormBuilder,
  ) {
    this.passwordresetconfirmForm = this.fb.group({
    new_password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    new_password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    });
  }

  resetPasswordConfirm() {
    // Sending hidden uid and token via POST.
    this.passwordresetconfirmForm.value['uid'] = this.navParams.get('uid');
    this.passwordresetconfirmForm.value['token'] = this.navParams.get('token');
    const data = this.passwordresetconfirmForm.value;
    this.up.resetPasswordConfirm(data)
      .then(() => {
        this.showAlert();
      }, (error) => {
        console.log(error);
      });
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      title: 'Reset Successful',
      subTitle: 'Your password reset has been successful.',
      buttons: [ {
        text: 'OK',
        handler: (data) => {
          this.navCtrl.push(LoginPage, { message: 'Please login to continue' });
        },
      }],
    });
    alert.present();
  }

}
