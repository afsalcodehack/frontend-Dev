import { HttpClient, HttpParams } from '@angular/common/http';
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
  getUserJWTUrl = backend.paths['api-token-oauth'].toURL();
  userListUrl = backend.paths['users'].toURL();
  convertTokenUrl = backend.paths['auth/convert-token'].toURL();
  emailInviteUrl = backend.paths['email-invite/invitations/create-and-send'].toURL();
  emailInviteAcceptUrl = backend.paths['email-invite/invitations/accept-invite'].toURL();
  userListByLocationUrl = backend.paths['map-pins/users'].toURL();

  constructor(public http: HttpClient, public storage: Storage,
  public events: Events) {
  }

  signupUser(user): Promise<any> {
    return this.http.post(this.signupUrl, user).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  socialLogin(req): any {
    return this.http.post(this.convertTokenUrl, req).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  getUserJWT(req): any {
    return this.http.post(this.getUserJWTUrl, null, { headers: req }).toPromise()
    .then((res: any) => {
      this.saveToken(res.token);
      this.events.publish('user:login');
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
    localStorage.setItem('token', token);
    this.storage.set('token', token);

    this.storage.get('token').then((data) => {
      console.log(data);
    });
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
      return res.user;
    });
  }

  getUserDetail(id: number): any {
    return this.http.get(this.userListUrl + `${id}/`).toPromise();
  }

  getUserListByLocation(bounds: any): Promise<any> {
    const params = new HttpParams()
      .set('latNE', bounds.latNE)
      .set('lngNE', bounds.lngNE)
      .set('latSW', bounds.latSW)
      .set('lngSW', bounds.lngSW);
    return this.http.get(this.userListByLocationUrl, { params }).toPromise();
  }

  verifyEmail(req): any {
    const key = req.key;
    return this.http.post(this.verifyEmailUrl + key + '/', {}).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  inviteUsingEmail(req): any {
    return this.http.post(this.emailInviteUrl, req).toPromise()
    .then((res: any) => {
      return res;
    });
  }

  acceptInvite(key): any {
    return this.http.get(this.emailInviteAcceptUrl + key + '/').toPromise()
    .then((res: any) => {
      return res;
    });
  }
}
