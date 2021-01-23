import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Events, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate';

import { loginWithNetlify } from '../../app/app.component';
import { maxPasswordLength, minPasswordLength } from '../../global';

import { PageTrack } from '../../decorators/PageTrack';
import { UserProvider } from '../../providers/user/user';

import { PasswordresetPage } from '../passwordreset/passwordreset';
import { SignupPage } from '../signup/signup';

@PageTrack()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {};
  message  = '';
  messageColor = 'secondary';
  loginWithNetlify = loginWithNetlify;

  public loginForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public events: Events,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ) {
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

  logForm() {
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
      }, (ex) => {
          this.loginForm.reset();
          let error_msg;
          try {
            // If there's an error message from backend
            error_msg = ex.error.non_field_errors[0];
          } catch (err) {
            error_msg = 'Account does not exist. Please use correct credentials to login.';
          }

          this.translate.get(error_msg)
            .subscribe((translated_text) => {
              this.message = translated_text;
            });
          this.messageColor = 'danger';
      });
  }

  signup(): void {
    this.navCtrl.push(SignupPage);
  }

  goToPasswordReset() {
    this.navCtrl.push(PasswordresetPage);
  }

  cleanupErrorMessage(): void {
    this.message = '';
  }

  socialSignIn() {
    this.events.publish('user:social-login');
  }
}
