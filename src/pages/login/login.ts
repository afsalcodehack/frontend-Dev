import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { UserProvider } from '../../providers/user/user';
import { Events } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { PasswordresetPage } from '../passwordreset/passwordreset';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {};
  message : string  = '';
  private loginForm : FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, private up: UserProvider,
  public events: Events, private formBuilder: FormBuilder) {
    this.user = {};
    this.message = this.navParams.get('message');
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
    });

  }

  logForm(){
    console.log(this.loginForm.value)
    this.login()
  }

  ionViewDidLoad() {
    this.user = {};
    this.message = this.navParams.get('message');

    this.up.isAuthenticated().then(loggedIn => {
      console.log(loggedIn);
      if (loggedIn) {
        this.navCtrl.push(HomePage);
      }
    })
  }

  login() : void {
    var data = this.loginForm.value;
    this.up.loginUser({'email': data['email'], 'password': data['password']})
      .then( usr => {
          this.events.publish('user:login');
          this.navCtrl.setRoot(HomePage);
          console.log(usr)
      },error => console.log(error));
  }

  signup(): void {
    this.navCtrl.push(SignupPage);
  }

  goToPasswordReset() {
    this.navCtrl.push(PasswordresetPage);
  }

}
