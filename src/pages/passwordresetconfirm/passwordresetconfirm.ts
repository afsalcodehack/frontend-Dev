import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { DeviceProvider } from '../../providers/device/device';
import { HomePage } from '../home/home'


@Component({
  selector: 'page-passwordresetconfirm',
  templateUrl: 'passwordresetconfirm.html',
})
export class PasswordresetconfirmPage {

  private passwordresetconfirmForm: FormGroup;
  private metadata: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public deviceStatus: DeviceProvider
  ) {
    this.passwordresetconfirmForm = this.fb.group({
    new_password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    new_password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    })
  }

  ionViewDidLoad() {
    let splitURL = document.URL.split("confirm/");
    this.metadata = splitURL[1].split("/");
  }

  resetPasswordConfirm() {
    // Sending hidden uid and token via POST.
    this.passwordresetconfirmForm.value['uid'] = this.metadata[0];
    this.passwordresetconfirmForm.value['token'] = this.metadata[1];
    var data = this.passwordresetconfirmForm.value;
    this.up.resetPasswordConfirm(data)
      .then( usr => {
        this.showAlert();
        },error => console.log(error));
  }

  showAlert() {
  let alert = this.alertCtrl.create({
    title: 'Reset Successful',
    subTitle: 'Your password reset has been successful.',
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
