import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { DeviceProvider } from '../../providers/device/device';
import { HomePage } from '../home/home'


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
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public deviceStatus: DeviceProvider
  ) {
    this.passwordresetForm = this.fb.group({
    email: ['', Validators.required],
    })
  }

  resetPasswordInitiate() {
    var data = this.passwordresetForm.value;
    this.up.resetPasswordInitiate(data)
      .then( usr => {
        this.showAlert();
        },error => console.log(error));
  }

  showAlert() {
  let alert = this.alertCtrl.create({
    title: 'Reset Initiated',
    subTitle: 'Password reset e-mail has been sent.',
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
