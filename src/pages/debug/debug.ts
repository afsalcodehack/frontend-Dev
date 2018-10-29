import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-debug',
  templateUrl: 'debug.html',
})
export class DebugPage {
  private records: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage) {
  }

  ionViewDidEnter() {
    this.fetchStorageRecords();
  }

  fetchStorageRecords() {
    this.records = [];

    this.storage.ready().then(() => {
      this.storage.forEach((val, key) => {
        this.records.push({ key, val });
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

}
