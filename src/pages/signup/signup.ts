import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { PasswordresetPage } from '../passwordreset/passwordreset';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signup = false;
  user:any;
  private signupForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public fb: FormBuilder,
  ) {

    this.signupForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      termsAccepted: [false, Validators.requiredTrue],
    })
    this.user = {};
  }

  ionViewDidLoad() {
    this.user = {};
    console.log('ionViewDidLoad SignupPage');
  }

  create() : void {
    var data = this.signupForm.value;
    this.up.signupUser({'username': data['email'], 'email': data['email'], 'password': data['password1']})
      .then( usr => {
        this.signup = true;
        this.navCtrl.push(LoginPage, { 'message' : usr.detail })
      },error => console.log(error));
  }

  login() : void {
    this.navCtrl.push(LoginPage);
  }

  goToPasswordReset() {
    this.navCtrl.push(PasswordresetPage);
  }

}
