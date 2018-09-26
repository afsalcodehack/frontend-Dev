import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EventPage } from '../event/event';
import { EventCreatePage } from '../eventcreate/eventcreate';
import { EventProvider } from '../../providers/event/event';

/**
 * Generated class for the EventlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-event-list',
  templateUrl: 'eventlist.html',
})
export class EventListPage {

  events = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public eventProvider: EventProvider,
  ) {
  }

  async ionViewDidLoad() {
     this.events = await this.eventProvider.getEvents()
  }

  eventSelected(event) {
    this.navCtrl.push(EventPage, {
      id: event.id,
    });
  }

  create() {
    this.navCtrl.push(EventCreatePage);
  }

}
