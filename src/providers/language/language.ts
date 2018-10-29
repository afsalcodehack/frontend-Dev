import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class LanguageProvider {

  constructor(public http: HttpClient, public storage: Storage) {
  }

  saveLanguage(lang): void {
    this.storage.set('lang', lang);
  }

  getLanguage() {
    return this.storage.get('lang').then((level) => {
      return level;
    });
  }
}
