import { Component } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { DeviceProvider } from '../../providers/device/device';
import { I18nAlertProvider } from '../../providers/i18n-alert/i18n-alert';

import { nonMenuPages } from '../../app/app.module';
import { backendUrl, buildInformation, environment } from '../../global';

@Component({
  selector: 'page-debug',
  templateUrl: 'debug.html',
})
export class DebugPage {
  private records: any = [];
  isNetlify = buildInformation.isNetlifyBuild;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public device: Device,
              public dp: DeviceProvider,
              public i18nAlert: I18nAlertProvider) {
  }

  ionViewDidEnter() {
    this.fetchStorageRecords();
  }

  fetchStorageRecords() {
    this.records = [
      { key: 'backendUrl', val: backendUrl },
      { key: 'environment', val: environment },
    ];

    this.storage.ready().then(() => {
      this.storage.forEach((val, key) => {
        this.records.push({ key, val: JSON.stringify(val, null, 2) });
      });
    });
  }

  clearAllRecords() {
    this.storage.clear().then(() => {
      this.fetchStorageRecords();
    });
  }

  clearSingleRecord(key) {
    this.storage.remove(key).then(() => {
      this.fetchStorageRecords();
    });
  }

  buildInfo() {
    return {
      Commit: buildInformation.commit,
      Branch: buildInformation.branch,
    };
  }

  deviceInfo() {
    return {
      Cordova: this.device.cordova,
      Manufacturer: this.device.manufacturer,
      Model: this.device.model,
      Platform: this.device.platform,
      Version: this.device.version,
      Serial: this.device.serial,
    };
  }

  async openI18nAlert(includeTitle = true) {
    const random = (Math.random() * 100).toFixed();
    let conditionalConfig = {};

    if (includeTitle) {
      conditionalConfig = {
        title: 'Description',
      };
    }

    const alert = await this.i18nAlert.create({
      ...conditionalConfig,
      message: 'You have purchased {{product}}',
      inputs: [{ placeholder: 'Last Name' }],
      buttons: [{ text: 'Cancel' }, 'Okay'],
    }, { message: { product: `${random} units of everything` }});

    alert.present();
  }

  launchers() {
    const launchSafely = (page) => {
      return this.navCtrl.push(page);
    };

    const launcherMap: any = {};
    Object.keys(nonMenuPages).forEach((name) => {
      const page = nonMenuPages[name];
      launcherMap[name] = () => launchSafely(page);
    });

    return launcherMap;
  }

}
