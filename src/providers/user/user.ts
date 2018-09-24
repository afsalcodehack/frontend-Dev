import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { AuthHttp } from 'angular2-jwt';

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
  public events: Events, public authHttp: AuthHttp) {
  }

  signupUser(user): Promise<any> {
    return this.http.post(this.signupUrl, user).toPromise()
    .then(function(res:any) {
      return res;
    });
  }

  loginUser(user): Promise<any> {
    var self = this;
    return this.http.post(this.loginUrl, user).toPromise()
    .then(function(res:any) {
      self.saveToken(res.token);
      self.events.publish('user:login');
      return res;
    });
  }

  saveToken(token) {
    this.storage.set('token', token);
  }

  resetPasswordInitiate(user): Promise<any> {
    return this.http.post(this.resetpasswordUrl, user).toPromise()
    .then(function(res:any) {
      return res;
    });
  }

  resetPasswordConfirm(user): Promise<any> {
    return this.http.post(this.resetpasswordconfirmUrl, user).toPromise()
    .then(function(res:any) {
      return res;
    });
  }

  changePassword(user): Promise<any> {
    return this.http.post(this.changepasswordUrl, user).toPromise()
    .then(function(res:any) {
      return res;
    });
  }

  updateInfo(user): Promise<any> {
    return this.authHttp.post(this.changeuserdataUrl, user).toPromise()
    .then(function(res:any) {
      return res;
    });
  }

  isAuthenticated() {
    return this.storage.get('token');
  }

  logout() {
    this.storage.remove('token')
    this.events.publish('user:logout');
    return true;
  }

  uploadImage(json) : Promise<any> {
    return this.http.post(this.imageUploadUrl , json).toPromise()
    .then(function(res:any) {
      return res;
    })
  }

  getUserInfo() : any {
    return this.authHttp.post(this.getUserInfoUrl , {}).toPromise()
    .then(function(res:any) {
      return res;
    })
  }

  desktopImageSelect (headers, formData, param) {
    return this.authHttp.put(this.getUserInfoUrl, formData, {
        headers: headers
      }).toPromise()
      .then(res => {
        return res;
      })
  }

  verifyEmail(req) : any {
    var key = req.key;
    return this.authHttp.post(this.verifyEmailUrl + key + '/', {}).toPromise()
    .then(function(res:any) {
      return res;
    })
  }

}
