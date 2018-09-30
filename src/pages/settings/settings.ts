import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { lang } from './settings.constants';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LanguageProvider } from '../../providers/language/language';
import { PageLocationProvider } from '../../providers/page-location/page-location';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    translate: TranslateService,
    public lp: LanguageProvider,
    public pageLocation: PageLocationProvider,
  ) {
    this.translate = translate;
  }

  languages = lang.availableLanguages;
  selectedLanguage = lang.sysOptions.systemLanguage;

  private translate: TranslateService;

  applyLanguage() {
    this.translate.use(this.selectedLanguage);
    this.lp.saveLanguage(this.selectedLanguage);
    lang.sysOptions.systemLanguage = this.selectedLanguage;
  }

}
