import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events, NavController, NavParams } from 'ionic-angular';
import { maxPasswordLength, minPasswordLength } from '../../global';
import { UserProvider } from '../../providers/user/user';
import { PasswordresetPage } from '../passwordreset/passwordreset';
import { SignupPage } from '../signup/signup';
import { PageTrack } from '../../decorators/PageTrack';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@PageTrack()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {};
  message  = '';
  private loginForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, private up: UserProvider,
  public events: Events, private formBuilder: FormBuilder) {
    this.user = {};
    this.message = this.navParams.get('message');
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(minPasswordLength),
        Validators.maxLength(maxPasswordLength)],
      )],
    });

  }

  logForm(){
    console.log(this.loginForm.value);
    this.login();
  }

  ionViewDidLoad() {
    this.user = {};
    this.message = this.navParams.get('message');

    this.up.isAuthenticated().then((loggedIn) => {
      console.log(loggedIn);
      if (loggedIn) {
        this.navCtrl.setRoot('root');
      }
    });
  }

  login(): void {
    const data = this.loginForm.value;
    this.up.loginUser({ email: data['email'], password: data['password'] })
      .then(() => {
          this.events.publish('user:login');
          this.navCtrl.setRoot('root');
      }, (error) => {
        console.log(error);
      });
  }

  signup(): void {
    this.navCtrl.push(SignupPage);
  }

  goToPasswordReset() {
    this.navCtrl.push(PasswordresetPage);
  }
}
