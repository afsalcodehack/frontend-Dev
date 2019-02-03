import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { EventProvider } from '../../providers/event/event';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';
import { UserProvider } from '../../providers/user/user';

import { EventPage } from '../event/event';
import { EventCreatePage } from '../eventcreate/eventcreate';

@PageTrack()
@Component({
  selector: 'page-event-list',
  templateUrl: 'eventlist.html',
})
export class EventListPage {
  loggedIn: boolean;
  events = [];

  constructor(
    public alertCtrl: I18nAlertProvider,
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
    this.up.isAuthenticated().then((loggedIn) => {
      this.loggedIn = !!loggedIn;
    });
  }

  async ionViewDidLoad() {
     this.events = await this.eventProvider.getEvents();
  }

  async eventSelected(event) {
    const openEventPage = (secret= null) => {
      this.navCtrl.push(EventPage, {
        id: event.id,
        secret,
      });
    };

    if (!this.loggedIn && !event.isPublic) {
      const alert = await this.alertCtrl.create({
        title: 'Secret Event',
        message: 'Access to this event is protected by a secret key.',
        inputs: [
          {
            id: 'secret-input',
            name: 'secret',
            type: 'password',
            placeholder: 'Secret',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            cssClass: 'secret-submit',
            text: 'Submit',
            handler: (data) => {
              this.eventProvider.getAccessToken(event.id, data.secret)
                .then((res) => {
                  if (res['ok']) {
                    openEventPage(data.secret);
                  } else {
                    this.eventSelected(event);
                  }
                });
            },
          },
        ],
      });

      alert.present();
    } else {
      openEventPage();
    }
  }

  create() {
    this.navCtrl.push(EventCreatePage);
  }

}
