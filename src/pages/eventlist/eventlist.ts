import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { EventPage } from '../event/event';
import { EventCreatePage } from '../eventcreate/eventcreate';
import { EventProvider } from '../../providers/event/event';
import { UserProvider } from '../../providers/user/user';

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
  loggedIn: boolean;
  events = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public up: UserProvider,
    public ionicEvents: Events,
    public eventProvider: EventProvider,
  ) {
    this.loggedIn = false;
    this.setStatus();

    ionicEvents.subscribe('user:logout', () => {
      this.setStatus();
    });

    ionicEvents.subscribe('user:login', () => {
      this.setStatus();
    });
  }

  setStatus(): void {
    this.up.isAuthenticated().then(loggedIn => {
      this.loggedIn = !!loggedIn;
    });
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
