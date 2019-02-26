import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { backendUrl } from '../../global';
import { DeviceProvider } from '../../providers/device/device';
import { EventProvider } from '../../providers/event/event';
import { ImageUploadProvider } from '../../providers/image-upload/image-upload';
import { UserProvider } from '../../providers/user/user';
import { EventListPage } from '../eventlist/eventlist';

import { EventCreatePage } from '../eventcreate/eventcreate';

@PageTrack()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event: any = {};
  id: number;
  secret: string;
  backendUrl = backendUrl[backendUrl.length - 1] === '/'
               ? backendUrl.slice(0, -1)
               : backendUrl;
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

  async ionViewWillEnter() {
    this.init();
  }

  async ionViewDidLoad() {
    this.init();
  }

  async init() {
    this.userProvider.isAuthenticated().then((loggedIn) => {
      this.loggedIn = !!loggedIn;
    });

    this.id = this.navParams.get('id');
    this.secret = this.navParams.get('secret');
    this.loadData();
  }

  async loadData() {
    try {
      this.event = await this.eventProvider.getEvent(this.id, { secret: this.secret });
      this.event.album.images.forEach((photo) => {
        // real backend only returns relative path of photo
        // e.g. /real.jpg
        // fake backend provides full path of photo
        // e.g. https://www.example.com/fake.jpg
        if (!photo.fullResUrl.includes('http')) {
          photo.fullResUrl = this.backendUrl + photo.fullResUrl;
        }
        if (!photo.thumbUrl.includes('http')) {
          photo.thumbUrl = this.backendUrl + photo.thumbUrl;
        }
      });
    } catch (err) {
      console.log('get event error:', err);
      this.navCtrl.push(EventListPage);
    }

  }

  getAlbumCollections(album) {
    const collections = {};
    if (album) {
      album['images'].forEach((photo) => {
        let time = new Date(photo['createdAt']).getTime();

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

  addImageToEvent(url) {
    return this.eventProvider.updateEvent({ url })
      .then(() => this.loadData())
      .catch(() => {
        console.log('failed uploading');
      });
  }

  uploadSelectedImage(event) {
    const file = event.srcElement.files[0];
    const fileMap = { src: file };

    const params = { event_id: this.event.id, filename: 'default.jpg' };
    this.imageUploadProvider.desktopImageUpload(null, fileMap, params, 'post')
      .then((res) => console.log(res))
      .catch((err) => console.error(err))
      .then(() => {
        this.loadData();
      });
  }

  openSheetAndUpload() {
    this.imageUploadProvider.presentActionSheet((promise) => {
      promise.then((src) => {
        this.addImageToEvent(src);
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
