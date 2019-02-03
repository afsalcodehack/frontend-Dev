import { Component } from '@angular/core';
import {
  Events,
  IonicPage,
  NavController,
  NavParams,
  Popover,
  PopoverController,
  ViewController,
} from 'ionic-angular';
import { CookieConsentProvider } from '../../providers/cookie-consent/cookie-consent';

@IonicPage()
@Component({
  selector: 'page-cookie-consent',
  templateUrl: 'cookieconsent.html',
})
export class CookieConsentPage {

  public static create(popCtrl: PopoverController, data?: {}): Popover {
    return popCtrl.create(CookieConsentPage, data, {
      cssClass: 'cookie-consent',
      showBackdrop: true,
      enableBackdropDismiss: false,
    });
  }

  public static present(popCtrl: PopoverController, data?: {}): Promise<any> {
    const consent = CookieConsentPage.create(popCtrl, data);
    return consent.present({
      animate: true,
      animation: 'md-transition',
    });
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public events: Events,
              public ccp: CookieConsentProvider) {
  }

  ionViewDidLoad() {
    this.events.subscribe('consent:forceClose', () => this.close());
  }

  dismiss(consent = true) {
    return this.ccp.setConsent(consent).then(() => this.close());
  }

  close() {
    this.ccp.requesting = false;
    return this.viewCtrl.dismiss({}, '', {
      animate: true,
      animation: 'md-transition',
    });
  }

}
