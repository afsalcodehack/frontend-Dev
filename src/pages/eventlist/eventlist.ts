import { Component } from '@angular/core';
import { AlertController, Events, NavController, NavParams } from 'ionic-angular';
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
    public alertCtrl: AlertController,
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
    const openEventPage = () => {
      this.navCtrl.push(EventPage, {
        id: event.id,
      });
    }

    if (!this.loggedIn && !event.isPublic) {
      let alert = this.alertCtrl.create({
        title: 'Secret Event',
        message: 'Access to this event is protected by a secret key.',
        inputs: [
          {
            name: 'secret',
            type: 'password',
            placeholder: 'Secret',
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Submit',
            handler: (data) => {
              this.eventProvider.getAccessToken(event.id, data.secret)
                .then((res) => {
                  if (res['ok']) {
                    openEventPage();
                  } else {
                    this.eventSelected(event);
                  };
                });
            }
          }
        ]
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
