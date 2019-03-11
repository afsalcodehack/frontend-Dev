import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import {
  ActionSheetController,
  NavController,
  NavParams,
  Platform,
  ToastController,
} from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { DeviceProvider } from '../../providers/device/device';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';
import { ImageUploadProvider } from '../../providers/image-upload/image-upload';
import { UserProvider } from '../../providers/user/user';

import { backend } from '../../app/backend';
import { auth } from '../../app/constants';

@PageTrack()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userPets: any;
  lastImage: any;
  authToken: any;
  image: any;
  generated_image_name: any;
  selectedFiles: any;
  editMode = true;
  id: number;

  // should be set true if editing the profile is allowed
  profileOwner = true;

  private userInfoUrl = backend.paths['get-user-info'].toURL();
  private changePasswordForm: FormGroup;
  private user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public alertCtrl: I18nAlertProvider,
    public fb: FormBuilder,
    public deviceStatus: DeviceProvider,
    public imageUploadProvider: ImageUploadProvider,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public platform: Platform,
    public storage: Storage,
    public toastCtrl: ToastController,
  ) {
    this.id = parseInt(this.navParams.get('id'), 10);
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      new_password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      new_password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    });

  }

  showToast(toastText: string) {
    const toast = this.toastCtrl.create({
      message: toastText,
      duration: 3000,
    });
    toast.present();
  }

  ionViewDidLoad() {
    this.id = parseInt(this.navParams.get('id'), 10);
    this.up.isAuthenticated().then(async (loggedIn) => {
      const user = await this.up.getUserInfo();
      if (!this.id) {
        this.navCtrl.setRoot('profile', { id: user.id });
      } else {
        this.profileOwner = loggedIn && user.id === this.id;
        this.user = user;
      }
    }).catch(console.error);
  }

  changePassword() {
    // Set uid here and check the following link for details:
    // http://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html
    const data = this.changePasswordForm.value;
    this.up.changePassword(data)
      .then(() => {
        this.showAlertChangePassword();
      }, (error) => {
        console.log(error);
      });
  }

  userDetails() {
    // Set uid here and check the following link for details:
    // http://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html
    const data = this.user;
    delete data['image'];

    this.up.updateInfo(data)
      .then(() => {
        this.showAlertUserDetails();
      }, (error) => {
        console.log(error);
      });
  }

  presentActionSheetAndUpload() {
    this.imageUploadProvider.presentActionSheet((promise) => {
      promise.then((res) => {
        this.lastImage = res;
        this.user.image = res;
        return this.storage.get('token');
      }).then((val) => {
        this.authToken = val;
      });
    });
  }

  uploadImage() {
    // File for Upload
    const targetPath = this.lastImage;

    const params = this.user;
    delete params['image'];

    this.imageUploadProvider.mobileImageUpload(targetPath, this.userInfoUrl, this.authToken, { params })
      .then(() => this.user.image = { '360p': targetPath });
  }

  async showAlertChangePassword() {
    const alert = await this.alertCtrl.create({
      title: 'Successfully Changed',
      subTitle: 'Your password has been changed successfully.',
      buttons: [{
        text: 'OK',
        handler: (data) => {
          this.navCtrl.setRoot(ProfilePage);
        },
      }],
    });
    alert.present();
  }

  async showAlertUserDetails() {
    const alert = await this.alertCtrl.create({
      title: 'Successfully Changed',
      subTitle: 'Details Updated.',
      buttons: [{
        text: 'OK',
        handler: (data) => {
          this.navCtrl.setRoot(ProfilePage);
        },
      }],
    });
    alert.present();
  }

  onImageSelect(event) {
    const file = event.srcElement.files[0];
    const fileMap = { image: file };

    const params = { ...this.user };
    delete params.image;

    return this.imageUploadProvider.desktopImageUpload(this.userInfoUrl, fileMap, params, 'put')
      .then((res) => res['image'] ? res.image : this.fileToImgObject(file))
      .then((res) => this.user.image = res);
  }

  private fileToImgObject(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve({ '360p': reader.result });
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
  }

  getRoleName() {
    // Don't show role if they're a normal user
    if (this.user.role !== auth.roles[0]) {
      return auth.roleNames[this.user.role];
    }
  }

}
