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
  events: any[] = [];
  eventSource = [];
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
    this.loadData();

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

  async loadData() {
     await this.eventProvider.getEvents().then( (list) => {
      this.events = list;
      this.eventSource = list;
    });
  }

  setFilteredItems(event) {
    this.events = this.filterItems(event.value);
  }

  filterItems(searchTerm) {
    return this.eventSource.filter((item: any) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  async eventSelected(event) {
    const openEventPage = (secret= null) => {
      this.navCtrl.push(EventPage, {
        id: event.id,
        secret,
      });
    };

    if (!event.isPublic && !event.isCreator) {
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
