import { Component } from '@angular/core';
import { AlertController, Events, NavController, NavParams } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { UserProvider } from '../../providers/user/user';
import { EventPage } from '../event/event';
import { EventCreatePage } from '../eventcreate/eventcreate';
import { PageTrack } from '../../decorators/PageTrack';

/**
 * Generated class for the EventlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@PageTrack()
@Component({
  selector: 'page-event-list',
  templateUrl: 'eventlist.html',
})
export class EventListPage {
  loggedIn: boolean;
  user = {};
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
    this.up.isAuthenticated().then((loggedIn) => {
      this.loggedIn = !!loggedIn;
      if (this.loggedIn) {
        this.up.getUserInfo().then((user) => {
          this.user = user;
        });
      }
    });
  }

  async ionViewDidEnter() {
    this.events = await this.eventProvider.getEvents();
  }

  privateEventSecretModal(message, handler) {
    return this.alertCtrl.create({
      title: 'Secret Event',
      message,
      inputs: [
        {
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
          text: 'Submit',
          handler,
        },
      ],
    });
  }

  getAccessTokenAndNavigateToEvent(id, secret, on_ok_false) {
    return this.eventProvider.getAccessToken(id, secret).then((res) => {
      if (res['ok']) {
        this.navCtrl.push(EventPage, {
          id,
          token: 'dummy-token',
        });
      } else {
        on_ok_false(res);
      }
    });
  }

  eventSelected(event) {
    if (!this.loggedIn && !event.isPublic) {
      const alert = this.privateEventSecretModal(
        'Access to this event is protected by a secret key.', (data) => {
          this.getAccessTokenAndNavigateToEvent(event.id, data.secret, () => {
            this.eventSelected(event);
          });
        });

      alert.present();
    } else {
      this.navCtrl.push(EventPage, {
        id: event.id,
        token: 'dummy-access-token',
      });
    }
  }

  openPrivateEventBySecret() {
    const alert = this.privateEventSecretModal(
      'Enter Secret key of the event you want to visit.', (modal) => {
        this.eventProvider.search({ secret: modal.secret }).then((result) => {
          if (result['ok']) {
            if (result['result'].length > 0) {
              const id = result['result'][0];
              this.getAccessTokenAndNavigateToEvent(id, modal.secret, () => {
                this.eventSelected(event);
              });
            } else {
              this.openPrivateEventBySecret();
            }
          }
        });
      });

    alert.present();
  }

  create() {
    this.navCtrl.push(EventCreatePage);
  }

}
