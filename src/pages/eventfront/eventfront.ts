import { Component } from '@angular/core';
import { Events, NavController, ToastController } from 'ionic-angular';

import { PageTrack } from '../../decorators/PageTrack';
import { EventProvider } from '../../providers/event/event';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';
import { UserProvider } from '../../providers/user/user';

import { EventCreatePage } from '../eventcreate/eventcreate';
import { EventListPage } from '../eventlist/eventlist';
import { LoginPage } from '../login/login';

@PageTrack()
@Component({
  selector: 'page-eventfront',
  templateUrl: 'eventfront.html',
})
export class EventFrontPage {
  loggedIn: boolean;
  isCustomer: boolean;
  pageTitle: string;

  constructor(
    public alertCtrl: I18nAlertProvider,
    public navCtrl: NavController,
    public up: UserProvider,
    public events: Events,
    public eventProvider: EventProvider,
    public toastCtrl: ToastController,
  ) {
    this.loggedIn = false;
    this.isCustomer = false;
    this.pageTitle = 'Frontpage';
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
      if (this.loggedIn) {
        this.pageTitle = 'Photographer Frontpage';
      }
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

  setCustomer(): void {
    this.pageTitle = 'Customer Frontpage';
    this.isCustomer = true;
  }

  showToast(toastText: string) {
    const toast = this.toastCtrl.create({
      message: toastText,
      duration: 3000,
    });
    toast.present();
  }

  async getPurchasedPhotos() {
    const alert = await this.alertCtrl.create({
      title: 'Get purchased photos',
      message: 'Please enter the email ID to send all the purchased images to.',
      inputs: [
        {
          id: 'email-input',
          name: 'email',
          type: 'email',
          placeholder: 'Email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          cssClass: 'email-submit',
          text: 'Submit',
          handler: (data) => {
            if (!data.email) {
              this.showToast('Invalid email provided');
            } else {
              this.eventProvider.sendPhotosByEmail(data.email)
                .then((res) => {
                  if (res['ok']) {
                    this.showToast('Email sent');
                  } else {
                    const msg = res['detail'] ? res['detail'] : 'Error occured when sending email';
                    this.showToast(msg);
                  }
                });
            }
          },
        },
      ],
    });

    alert.present();
  }
}
