import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

import { backend } from '../../app/backend';

@Injectable()
export class UserProvider {

  signupUrl = backend.paths['rest-auth/registration'].toURL();
  loginUrl = backend.paths['rest-auth/login'].toURL();
  resetpasswordUrl = backend.paths['rest-auth/password/reset'].toURL();
  changepasswordUrl = backend.paths['rest-auth/password/change'].toURL();
  resetpasswordconfirmUrl = backend.paths['rest-auth/password/reset/confirm'].toURL();
  verifyEmailUrl = backend.paths['rest-auth/registration/account-confirm-email'].toURL();

  changeuserdataUrl = backend.paths['update-user-info'].toURL();
  imageUploadUrl = backend.paths['image-upload'].toURL();
  getUserInfoUrl = backend.paths['get-user-info'].toURL();

  constructor(public http: HttpClient, public storage: Storage,
  public events: Events) {
  }

  signupUser(user): Promise<any> {
    return this.http.post(this.signupUrl, user).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  loginUser(user): Promise<any> {
    return this.http.post(this.loginUrl, user).toPromise()
    .then((res: any) => {
      this.saveToken(res.token);
      this.events.publish('user:login');
      return res;
    });
  }

  saveToken(token) {
    this.storage.set('token', token);
  }

  resetPasswordInitiate(user): Promise<any> {
    return this.http.post(this.resetpasswordUrl, user).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  resetPasswordConfirm(user): Promise<any> {
    return this.http.post(this.resetpasswordconfirmUrl, user).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  changePassword(user): Promise<any> {
    return this.http.post(this.changepasswordUrl, user).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  updateInfo(user): Promise<any> {
    return this.http.post(this.changeuserdataUrl, user).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  isAuthenticated() {
    return this.storage.get('token');
  }

  logout() {
    this.storage.remove('token');
    this.events.publish('user:logout');
    return true;
  }

  uploadImage(json): Promise<any> {
    return this.http.post(this.imageUploadUrl, json).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  getUserInfo(): any {
    return this.http.post(this.getUserInfoUrl, {}).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  desktopImageSelect (headers, formData, param) {
    return this.http.put(this.getUserInfoUrl, formData, {
        headers,
      }).toPromise()
      .then((res: any) => {
        return res;
      });
  }

  verifyEmail(req): any {
    const key = req.key;
    return this.http.post(this.verifyEmailUrl + key + '/', {}).toPromise()
    .then((res: any) => {
      return res;
    });
  }

}
