import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import {
  ActionSheetController,
  ToastController,
} from 'ionic-angular';

import { backend } from '../../app/backend';

@Injectable()
export class ImageUploadProvider {
  imageUploadUrl = backend.paths['image-upload'].toURL();

  constructor(private camera: Camera,
              private transfer: Transfer,
              private http: HttpClient,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController) {
  }

  takePicture(sourceType) {
    const options = {
      quality: 100,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    // Get the data of an image
    return this.camera.getPicture(options)
      .then((imagePath) => imagePath, () => {
        this.presentToast('Error while selecting image.');
      });
  }

  presentToast(text) {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  mobileImageUpload(fileURI, url, authToken, options = {}) {
    url = url || this.imageUploadUrl;

    let mergedOpts = {
      fileKey: 'image',
      chunkedMode: false,
      httpMethod : 'PUT',
      mimeType: 'multipart/form-data',
      headers: {
        Authorization: `JWT ${authToken}`,
      },
    };

    const headers = { ...mergedOpts.headers, ...(options['headers'] || {}) };
    mergedOpts = { ...mergedOpts, ...options, headers };

    const fileTransfer: TransferObject = this.transfer.create();
    return fileTransfer.upload(fileURI, url, mergedOpts)
      .then((data) => data, (error) => {
        console.log(error);
        this.presentToast('An error was encountered while uploading image.');
      });
  }

  presentActionSheet(processor) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [{
          text: 'Photo Gallery',
          handler: () => processor(this.takePicture(
            this.camera.PictureSourceType.PHOTOLIBRARY)),
        },
        {
          text: 'Camera',
          handler: () => processor(this.takePicture(
            this.camera.PictureSourceType.CAMERA)),
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();
  }

  desktopImageUpload(url, fileMap, parameters: any = null, method = 'post', addHeaders = true) {
    url = url || this.imageUploadUrl;

    const formData = new FormData();
    Object.keys(fileMap).forEach((key) => {
      const file = fileMap[key];
      formData.append(key, file, file.name);
    });

    const params = parameters || {};
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key]);
    });

    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('mimeType', 'multipart/form-data');

    return this.http[method](url, formData, addHeaders ? { headers } : {})
      .toPromise();
  }

}
