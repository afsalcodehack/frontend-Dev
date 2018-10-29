import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';

import { UserProvider } from '../../providers/user/user';
import { EventCreatePage } from '../eventcreate/eventcreate';
import { EventListPage } from '../eventlist/eventlist';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-eventfront',
  templateUrl: 'eventfront.html',
})
export class EventFrontPage {
  loggedIn: boolean;

  constructor(
    public navCtrl: NavController,
    public up: UserProvider,
    public events: Events,
  ) {
    this.loggedIn = false;
    this.setStatus();

    events.subscribe('user:logout', () => {
      this.setStatus();
    });

    events.subscribe('user:login', () => {
      this.setStatus();
    });
  }

  setStatus(): void {
    this.up.isAuthenticated().then((loggedIn) => {
      this.loggedIn = !!loggedIn;
    });
  }

  nav(destination: string): void {
    switch (destination) {
      case 'event-list':
        this.navCtrl.push(EventListPage);
        break;
      case 'new-event':
        this.navCtrl.push(EventCreatePage);
        break;
      case 'login':
        this.navCtrl.push(LoginPage);
        break;
      default:
        console.warn(`selected destination: ${destination} is invalid`);
    }
  }
}
