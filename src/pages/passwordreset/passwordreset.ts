import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { PageTrack } from '../../decorators/PageTrack';

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
    public alertCtrl: AlertController,
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

  showAlert() {
  const alert = this.alertCtrl.create({
    title: 'Reset Initiated',
    subTitle: 'Password reset e-mail has been sent.',
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
