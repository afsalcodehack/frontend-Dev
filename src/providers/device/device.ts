import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class DeviceProvider {

  mobile = false;
  desktop = false;
  pixelWidth: number;
  isCordova = false;

  constructor(public http: HttpClient, public platform: Platform) {
    if (this.platform.is('cordova')) {
      this.isCordova = true;
    }
    this.pixelWidth = document.body.clientWidth;
    this.changeView();
  }

  onResize(event) {
    this.pixelWidth = event.target.innerWidth;
    this.changeView();
  }

  changeView() {
    if (this.pixelWidth <= 992) {
      this.desktop = false;
      this.mobile = true;
    } else {
      this.desktop = true;
      this.mobile = false;
    }
  }
}
