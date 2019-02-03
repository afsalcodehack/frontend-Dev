import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';

import * as moment from 'moment';
import 'moment/min/locales';

import { PageTrack } from '../../decorators/PageTrack';
import { LanguageProvider } from '../../providers/language/language';
import { PageLocationProvider } from '../../providers/page-location/page-location';
import { ThemeProvider } from '../../providers/theme/theme';

import { lang } from './settings.constants';

@PageTrack()
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
    public themeProvider: ThemeProvider,
  ) {
    this.translate = translate;
    this.themeProvider.getActiveTheme().subscribe((val) => {
      this.selectedTheme = val;
    });
    this.themes = themeProvider.getAvailableThemes();
  }

  themes: string[];
  selectedTheme: string;

  languages = lang.availableLanguages;
  selectedLanguage = lang.sysOptions.systemLanguage;

  private translate: TranslateService;

  applyLanguage() {
    this.translate.use(this.selectedLanguage);
    this.lp.saveLanguage(this.selectedLanguage);
    lang.sysOptions.systemLanguage = this.selectedLanguage;
    moment.locale(`${this.selectedLanguage}-${this.selectedLanguage}`);
  }

  toggleTheme() {
    if (this.selectedTheme) {
      this.themeProvider.setActiveTheme(this.selectedTheme);
    }
  }
}
