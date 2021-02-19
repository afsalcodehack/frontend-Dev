import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { UserProvider } from '../../providers/user/user';

import { LoginPage } from '../login/login';
import { PasswordresetPage } from '../passwordreset/passwordreset';

@PageTrack()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signup = false;
  user: any;
  private signupForm: FormGroup;
  private loading: Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public fb: FormBuilder,
    public loadingController: LoadingController
  ) {

    this.signupForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      termsAccepted: [false, Validators.requiredTrue],
    });
    this.user = {};

  }

  ionViewDidLoad() {
    this.user = {};
    console.log('ionViewDidLoad SignupPage');
  }

  async showOrHideLoading(isPending: boolean) {
     this.loading = this.loadingController.create({
      content: 'Please wait',
    });
    this.loading.present();
  }

  create(): void {
    this.showOrHideLoading(true);
    const data = this.signupForm.value;
    this.up.signupUser({ username: data['email'], email: data['email'], password: data['password1'] })
      .then((user) => {
        this.loading.dismiss();
        this.signup = true;
        this.navCtrl.push(LoginPage, { message : user.detail });
      }, (error) => {
        this.loading.dismiss();
        console.log(error);
      });
  }

  login(): void {
    this.navCtrl.push(LoginPage);
  }

  goToPasswordReset() {
    this.navCtrl.push(PasswordresetPage);
  }

}
