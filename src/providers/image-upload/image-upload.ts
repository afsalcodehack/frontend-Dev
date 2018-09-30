import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transfer, TransferObject } from "@ionic-native/transfer";
import { Camera } from "@ionic-native/camera";
import { Platform, ToastController, ActionSheetController, LoadingController, Loading } from "ionic-angular";
import { DeviceProvider } from "../device/device";
import { Storage } from '@ionic/storage';
import { File } from "@ionic-native/file";
import { backendUrl } from "../../global";


declare var cordova : any;

/*
  Generated class for the ImageUploadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageUploadProvider {
  loading: Loading;
  authToken: any;
  userUrl = backendUrl + 'rest-auth/user/';
  petsUrl = backendUrl + 'pets/profile'

  constructor(public http: HttpClient,private camera: Camera, private transfer: Transfer, private file: File,
  public actionSheetCtrl: ActionSheetController,
  public toastCtrl: ToastController, public platform: Platform,
  public loadingCtrl: LoadingController, public deviceStatus: DeviceProvider,
  public storage: Storage) {
    this.storage.get('token').then((val) => {
      this.authToken = val;
    });
  }

  takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    // Get the data of an image
    return this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      return imagePath;
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  pathHandler(sourceType, imagePath) {

    /*
    Special handler for android due to the path of images which Android
    system returns is not relative but a very long absolute path consisting of multiple directories, hence path is split up and only
    the relevant info is extracted from full path.
    */
    /* broken
    return this.filePath.resolveNativePath(imagePath)
      .then(filePath => {
        let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

        return {
          'correctPath' : correctPath,
          'currentName' : currentName
        }
      });
    */
    return {}
  }

  // Create a new name for the image
  createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  copyFileToLocalDir(namePath, currentName, newFileName) {
    return this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
       return newFileName;
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  uploadImage(authToken, targetPath, options, param) {
    var url = this.userUrl
    if (param && param.toString().length > 0) {
      url = this.petsUrl + param + '/';
    }
    const fileTransfer: TransferObject = this.transfer.create();


    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options).then(data => {
      this.presentToast('Image successfully uploaded.');
      return data;
    }, err => {
      this.presentToast('Error while uploading file.');
    });
  }

  presentActionSheet(processor) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [{
          text: 'Photo Gallery',
          handler: () => {
            let sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;

            let promise = this.takePicture(sourceType).then(imagePath => {
              if (this.platform.is('android') &&
                  sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

                return this.pathHandler(sourceType, imagePath);
              } else {

                return new Promise(function(resolve) {
                  let currentName = imagePath.substr(
                    imagePath.lastIndexOf('/') + 1);

                  let correctPath = imagePath.substr(
                    0, imagePath.lastIndexOf('/') + 1);

                  resolve({
                    correctPath,
                    currentName,
                  });
                });
              }
            }).then(res => {
              let correctPath = res['correctPath'];
              let currentName = res['currentName'];

              return this.copyFileToLocalDir(
                correctPath, currentName, this.createFileName());
            });

            processor(promise);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            let promise = this.takePicture(
              this.camera.PictureSourceType.CAMERA);

            processor(promise);
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

}
