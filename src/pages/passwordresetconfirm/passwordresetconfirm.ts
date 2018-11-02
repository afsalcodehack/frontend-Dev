import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { PageTrack } from '../../decorators/PageTrack';

@PageTrack()
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
  ) {
    this.passwordresetconfirmForm = this.fb.group({
    new_password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    new_password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    });
  }

  ionViewDidLoad() {
    const splitURL = document.URL.split('confirm/');
    this.metadata = splitURL[1].split('/');
  }

  resetPasswordConfirm() {
    // Sending hidden uid and token via POST.
    this.passwordresetconfirmForm.value['uid'] = this.metadata[0];
    this.passwordresetconfirmForm.value['token'] = this.metadata[1];
    const data = this.passwordresetconfirmForm.value;
    this.up.resetPasswordConfirm(data)
      .then(() => {
        this.showAlert();
      }, (error) => {
        console.log(error);
      });
  }

  showAlert() {
  const alert = this.alertCtrl.create({
    title: 'Reset Successful',
    subTitle: 'Your password reset has been successful.',
    buttons: [ {
      text: 'OK',
      handler: (data) => {
      this.navCtrl.setRoot('root');
      },
    }],
  });
    alert.present();
  }

}
