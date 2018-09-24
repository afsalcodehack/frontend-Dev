import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';
import { EventProvider } from '../../providers/event/event';

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
  ) {
  }

  async ionViewDidLoad() {
    const id = this.navParams.get('id');
    this.event = await this.eventProvider.getEvent(id);
  }

}
