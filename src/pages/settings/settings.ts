import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { lang } from './settings.constants';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LanguageProvider } from '../../providers/language/language';
import { TandcPage } from '../tandc/tandc';


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
  ) {
    this.translate = translate;
  }

  languages = lang.availableLanguages;
  selectedLanguage = lang.sysOptions.systemLanguage;

  param = { value: 'world' };

  private translate: TranslateService;

  applyLanguage() {
    this.translate.use(this.selectedLanguage);
    this.lp.saveLanguage(this.selectedLanguage);
    lang.sysOptions.systemLanguage = this.selectedLanguage;
  }

  goToTandC() {
    this.navCtrl.push(TandcPage);
  }

}
