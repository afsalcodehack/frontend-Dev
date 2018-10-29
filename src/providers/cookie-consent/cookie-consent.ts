import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';

@Injectable()
export class CookieConsentProvider {

  private consentStorageKey = 'cookie-consent';
  public requesting = false;

  constructor(public storage: Storage, public events: Events) {
  }

  setConsent(consented = true): Promise<void> {
    return this.storage.set(this.consentStorageKey, consented).then(() => {
      this.events.publish('consent:changed', consented);
    });
  }

  getConsent(): Promise<boolean> {
    return this.storage.get(this.consentStorageKey).then((consent) => {
      return consent === true;
    });
  }

}
