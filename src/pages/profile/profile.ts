import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';
import {
  ActionSheetController,
  AlertController,
  NavController,
  NavParams,
  Platform,
} from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';
import { ImageUploadProvider } from '../../providers/image-upload/image-upload';
import { UserProvider } from '../../providers/user/user';
import { PageTrack } from '../../decorators/PageTrack';

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

  private changePasswordForm: FormGroup;
  private user: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private up: UserProvider,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public deviceStatus: DeviceProvider,
    public imageUploadProvider: ImageUploadProvider,
    public actionSheetCtrl: ActionSheetController,
    public camera: Camera,
    public platform: Platform,
    public storage: Storage,
  ) {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      new_password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      new_password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    });

  }

  ionViewDidLoad() {
    this.up.isAuthenticated().then((res) => {
      if (res) { return this.up.getUserInfo(); }
    }).then((res) => {
      this.user = JSON.parse(res._body)['user'];
    });

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
            this.user.image = this.imageUploadProvider.pathForImage(res);
            return this.storage.get('token');
        }).then((val) => {
          this.authToken = val;
        });
    });
  }

  uploadImage() {
    // File for Upload
    const targetPath = this.imageUploadProvider.pathForImage(this.lastImage);

    const params = this.user;

    delete params['image'];

    const options = {
      fileKey: 'image',
      chunkedMode: false,
      httpMethod : 'PUT',
      mimeType: 'multipart/form-data',
      params,
      headers: { Authorization: 'JWT ' + this.authToken },
    };

    this.imageUploadProvider.uploadImage(this.authToken, targetPath, options, null).then((res) => {
      console.log(JSON.stringify(res));
    });
  }

  showAlertChangePassword() {
    const alert = this.alertCtrl.create({
    title: 'Successfully Changed',
    subTitle: 'Your password has been changed successfully.',
    buttons: [ {
      text: 'OK',
      handler: (data) => {
      this.navCtrl.setRoot(ProfilePage);
      },
      }],
    });
    alert.present();
  }

  showAlertUserDetails() {
    const alert = this.alertCtrl.create({
    title: 'Successfully Changed',
    subTitle: 'Details Updated.',
    buttons: [ {
      text: 'OK',
      handler: (data) => {
        this.navCtrl.setRoot(ProfilePage);
      },
      }],
    });
    alert.present();
  }

  onImageSelect(event) {
    const file = event.srcElement.files;
    const formData = new FormData();
    const headers = new Headers();
    formData.append('image', file[0], file[0].name);
    const keys = Object.keys(this.user);
    delete keys['image'];

    keys.forEach((key) => {
      formData.append(key, this.user[key]);
    });

    this.up.desktopImageSelect(headers, formData, null).then((res) => {

    });
  }

}
