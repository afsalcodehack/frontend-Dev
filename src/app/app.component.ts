import { Component, ViewChild } from '@angular/core';

import { Events, Nav, Platform } from 'ionic-angular';
import { CacheService } from 'ionic-cache';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { Globalization } from '@ionic-native/globalization';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { EventListPage } from '../pages/eventlist/eventlist';
import { SignupPage } from '../pages/signup/signup';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { ProductPage } from '../pages/product/product';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';

import { DeviceProvider } from '../providers/device/device';
import { LanguageProvider } from '../providers/language/language';
import { UserProvider } from '../providers/user/user';

import { lang } from '../pages/settings/settings.constants';

let _ = function(a) { return a; };


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = EventListPage;
  pages: Array<{title: string, id: string, component: any, status: any, divide: any}>;
  @ViewChild(Nav) nav: Nav;

  constructor(
    cache: CacheService,
    public platform: Platform,
    public statusBar: StatusBar,
    public deviceStatus: DeviceProvider,
    public splashScreen: SplashScreen,
    public up: UserProvider,
    public events: Events,
    public translate: TranslateService,
    public globalization: Globalization,
    public lp: LanguageProvider
  ) {

    let url = new URL(window.location.href);

    if (url.hash.indexOf('verify-email?key') > -1) {
      let key = url.hash.split('=')[1];
      this.up.verifyEmail({'key' : key}).then(req => {
        this.nav.setRoot(LoginPage, {message: 'Email Verified Successfully!'});
      })
    }

    let self = this;
    this.initializeApp();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      translate.setDefaultLang(lang.defaultLanguage);

      this.lp.getLanguage().then(res => {
        if (res) {
          translate.use(res);
          lang.sysOptions.systemLanguage = res;
        } else {
          let language;
          if ((<any>window).cordova) {
            this.globalization.getPreferredLanguage().then(result => {
              language = this.getSuitableLanguage(result.value);
              translate.use(language);
              lang.sysOptions.systemLanguage = language;
            });
          } else {
            let browserLanguage = translate.getBrowserLang() || lang.defaultLanguage;
            language = this.getSuitableLanguage(browserLanguage);
            translate.use(language);
            lang.sysOptions.systemLanguage = language;
          }
          this.lp.saveLanguage(language)
        }
      })

      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }
      cache.setDefaultTTL(3600);
    });

    this.pages = [
      { title: _('Home'), id: 'home', component: HomePage, status: false, divide: true},
      { title: _('Settings'), id: 'settings', component: SettingsPage, status: false, divide: false},
      { title: _('Product'), id: 'product', component: ProductPage, status: false, divide: false},
      { title: _('Event'), id: 'event-list', component: EventListPage, status: false, divide: false},
      { title: _('Signup/Login'), id: 'login', component: LoginPage, status: false, divide: false},
      { title: _('Profile'), id: 'profile', component: ProfilePage, status: false, divide: false},
      { title: _('Logout'), id: 'logout', component: LogoutPage, status: false, divide: false},
      { title: _('About'), id: 'about', component: AboutPage, status: false, divide: false},
    ];

    events.subscribe('user:logout', () => {
      this.setStatus();
    });

    events.subscribe('user:login', (res) => {
      this.setStatus();
    });

    var securedPages = [
      'Logout',
      'Profile',
    ];

    self.pages.forEach(page => {
      if (securedPages.indexOf(page.title) < 0) {
        page.status = true;
      }
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component == LoginPage || page.component == SignupPage) {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);
    }
  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return lang.availableLanguages.some(x => x.code == language) ? language : lang.defaultLanguage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }
      this.setStatus();
    });
  }

  setStatus() {
    var self = this;
    this.up.isAuthenticated().then(loggedIn => {
      if (loggedIn) {
        self.pages.forEach(page => {
          page.status = true;
          if (page.component == LoginPage || page.component == SignupPage) {
            page.status = false;
          }
        })
      } else {
        self.pages.forEach(page => {
          if (page.component == LogoutPage || page.component == ProfilePage) {
            page.status = false;
          }
          if (page.component == LoginPage ||  page.component == SignupPage) {
            page.status = true;
          }
        })
      }
    });
  }
}
