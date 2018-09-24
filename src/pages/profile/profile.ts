import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { DeviceProvider } from '../../providers/device/device';
import { AlertController } from 'ionic-angular';
import { ActionSheetController, Platform } from 'ionic-angular';
import { ImageUploadProvider } from "../../providers/image-upload/image-upload";
import { Camera } from "@ionic-native/camera";
import { Storage } from '@ionic/storage';


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
  private user : any;


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
    public storage: Storage
  ) {
    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      new_password1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      new_password2: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    })

  }

  ionViewDidLoad() {
    var self = this;
    self.up.isAuthenticated().then(res=> {
      if(res) return self.up.getUserInfo()
    }).then(res=> {
      self.user = JSON.parse(res._body)['user'];
    })

  }

  changePassword() {
    // Set uid here and check the following link for details:
    // http://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html
    var data = this.changePasswordForm.value;
    this.up.changePassword(data)
      .then( usr => {
        this.showAlertChangePassword();
        },error => console.log(error));
  }

  userDetails() {
    // Set uid here and check the following link for details:
    // http://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html
    var data = this.user;
    delete data['image'];

    this.up.updateInfo(data)
      .then( usr => {
        this.showAlertUserDetails();
        },error => console.log(error));
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            var sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.imageUploadProvider.takePicture(sourceType).then(imagePath=> {
              if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
                return this.imageUploadProvider.pathHandler(sourceType, imagePath)
              } else {
                return new Promise(function(resolve){
                  var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
                  var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

                  resolve ({
                    'correctPath' : correctPath,
                    'currentName' : currentName
                  })
                });
              }

            }).then(res => {
                var correctPath = res['correctPath'];
                var currentName = res['currentName'];
                return this.imageUploadProvider.copyFileToLocalDir(correctPath, currentName, this.imageUploadProvider.createFileName());
            }).then(res => {
               this.lastImage = res;
               this.user.image = this.imageUploadProvider.pathForImage(res);
               return this.storage.get('token')
            }).then((val) => {
              this.authToken = val;
            });
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.imageUploadProvider.takePicture(this.camera.PictureSourceType.CAMERA).then(res=> {

            }) ;
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  uploadImage() {
    // File for Upload
    var targetPath = this.imageUploadProvider.pathForImage(this.lastImage);

    var params = this.user;

    delete params['image'];

    var options = {
      fileKey: "image",
      chunkedMode: false,
      httpMethod : 'PUT',
      mimeType: "multipart/form-data",
      params : params,
      headers: { Authorization: 'JWT '+ this.authToken }
    };

    this.imageUploadProvider.uploadImage(this.authToken, targetPath, options, null).then(res => {
      console.log(JSON.stringify(res));
    })
  }

  showAlertChangePassword() {
    let alert = this.alertCtrl.create({
    title: 'Successfully Changed',
    subTitle: 'Your password has been changed successfully.',
    buttons: [ {
      text: 'OK',
      handler: data => {
      this.navCtrl.setRoot(ProfilePage);
      }
      }],
    });
    alert.present();
  }

  showAlertUserDetails() {
    let alert = this.alertCtrl.create({
    title: 'Successfully Changed',
    subTitle: 'Details Updated.',
    buttons: [ {
      text: 'OK',
      handler: data => {
        this.navCtrl.setRoot(ProfilePage);
      }
      }],
    });
    alert.present();
  }


  onImageSelect(event) {
    let file = event.srcElement.files;
    var formData = new FormData();
    let headers = new Headers();
    formData.append('image', file[0], file[0].name);
    var keys = Object.keys(this.user);
    delete keys['image'];

    keys.forEach(key => {
      formData.append(key, this.user[key])
    })

    this.up.desktopImageSelect(headers, formData, null).then(res => {

    })
  }

}
