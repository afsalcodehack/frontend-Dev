import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventCreatePage } from '../../pages/eventcreate/eventcreate';
import { EventListPage } from '../../pages/eventlist/eventlist';
import { DeviceProvider } from '../../providers/device/device';
import { EventProvider } from '../../providers/event/event';
import { ImageUploadProvider } from '../../providers/image-upload/image-upload';
import { UserProvider } from '../../providers/user/user';
import { PageTrack } from '../../decorators/PageTrack';

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@PageTrack()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event = {};
  loggedIn = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public deviceStatus: DeviceProvider,
    public eventProvider: EventProvider,
    public userProvider: UserProvider,
    public imageUploadProvider: ImageUploadProvider,
  ) {
  }

  async ionViewDidEnter() {
    this.userProvider.isAuthenticated().then((loggedIn) => {
      this.loggedIn = !!loggedIn;
    });

    if (!this.navParams.get('token')) {
      this.navCtrl.setRoot(EventListPage);
    }

    const id = parseInt(this.navParams.get('id'), 10);
    const response = await this.eventProvider.getEvent(id);
    this.event = response['result'];
  }

  getAlbumCollections(album) {
    const collections = {};

    if (album) {
      album['images'].forEach((photo) => {
        let time = photo['createdAt'];

        // group images by hour
        time = time - time % 3600000;

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
      .catch(() => {
        console.log('failed uploading');
      });
  }

  uploadSelectedImage(event) {
    const file = event.srcElement.files[0];
    const reader = new FileReader();

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
      }, () => {
        console.log('failed selecting image');
      });
    });
  }

  editEventInfo() {
    this.navCtrl.push(EventCreatePage, {
      id: this.event['id'],
    });
  }

}
