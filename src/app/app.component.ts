import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events } from 'ionic-angular';

import { UserProvider } from '../providers/user/user';
import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { ServicePage } from '../pages/service/service';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage} from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { LogoutPage } from '../pages/logout/logout';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { TandcPage } from '../pages/tandc/tandc';
import { ProductPage } from '../pages/product/product';
import { EventListPage } from '../pages/eventlist/eventlist';

import { CacheService } from "ionic-cache";

import { LanguageProvider } from '../providers/language/language';
import { DeviceProvider } from '../providers/device/device';

import { lang } from '../pages/settings/settings.constants';
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from 'ng2-translate/ng2-translate';

let _ = function(a) { return a; };


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  pages: Array<{title: string, component: any, status: any, divide: any}>;
  @ViewChild(Nav) nav: Nav;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public deviceStatus: DeviceProvider,
    public splashScreen: SplashScreen,
    public up: UserProvider,
    public events: Events,
    cache: CacheService,
    public translate: TranslateService,
    public  globalization: Globalization,
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

      statusBar.styleDefault();
      splashScreen.hide();
      cache.setDefaultTTL(3600);
    });

    this.pages = [
      { title: _('Home'), component: HomePage, status: false, divide: true},
      { title: _('Service'), component: ServicePage, status: false , divide: true},
      { title: _('Settings'), component: SettingsPage, status: false, divide: false},
      { title: _('Product'), component: ProductPage, status: false, divide: false},
      { title: _('Event'), component: EventListPage, status: false, divide: false},
      { title: _('Signup/Login'), component: LoginPage, status: false, divide: false},
      { title: _('Search Page'), component: SearchPage, status: false, divide: true},
      { title: _('Profile'), component: ProfilePage, status: false, divide: false},
      { title: _('Logout'), component: LogoutPage, status: false, divide: false},
      { title: _('About'), component: AboutPage, status: false, divide: false},
    ];

    events.subscribe('user:logout', () => {
      this.setStatus();
    });

    events.subscribe('user:login', (res) => {
      this.setStatus();
    });

    self.pages.forEach(page => {
      if (page.component != LogoutPage && page.component != ProfilePage) {
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
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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

  goToTandC() {
    this.nav.setRoot(TandcPage);
  }
}
