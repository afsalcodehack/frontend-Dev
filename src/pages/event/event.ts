import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';
import { EventProvider } from '../../providers/event/event';
import { UserProvider } from '../../providers/user/user'
import { ImageUploadProvider } from "../../providers/image-upload/image-upload";

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public deviceStatus: DeviceProvider,
    public eventProvider: EventProvider,
    public userProvider: UserProvider,
    public imageUploadProvider: ImageUploadProvider,
  ) {
  }

  async ionViewDidLoad() {
    const id = this.navParams.get('id');
    this.event = await this.eventProvider.getEvent(id);
  }

  getAlbumCollections(album) {
    let collections = {};

    if (album) {
      album['images'].forEach(photo => {
        let time = photo['createdAt'];

        // group images by hour
        time = time - time%3600000;

        if (!collections[time]) {
          collections[time] = [];
        }

        collections[time].push(photo);
      });
    }

    return collections;
  }

  uploadImage(src) {
    return this.userProvider.uploadImage({ src })
      .then((res) => this.eventProvider.updateEvent({ url: res.url }))
      .catch(() => console.log('failed uploading'));
  }

  uploadSelectedImage(event) {
    let file = event.srcElement.files[0];
    let reader = new FileReader();

    reader.onloadend = () => {
      this.uploadImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  openSheetAndUpload() {
    this.imageUploadProvider.presentActionSheet((promise) => {
      promise.then((src) => {
        if (src) {
          this.uploadImage(src);
        }
      }, () => console.log('failed selecting image'));
    });
  }

}
