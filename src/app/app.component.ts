import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { Events, Nav, Platform, PopoverController } from 'ionic-angular';
import { CacheService } from 'ionic-cache';

import * as moment from 'moment';
import 'moment/min/locales';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { Globalization } from '@ionic-native/globalization';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AboutPage } from '../pages/about/about';
import { CookieConsentPage } from '../pages/cookieconsent/cookieconsent';
import { DebugPage } from '../pages/debug/debug';
import { EventFrontPage } from '../pages/eventfront/eventfront';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { PasswordresetconfirmPage } from '../pages/passwordresetconfirm/passwordresetconfirm';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { VerifyemailPage } from '../pages/verifyemail/verifyemail';

import { EventListPage } from '../pages/eventlist/eventlist';

import { CookieConsentProvider } from '../providers/cookie-consent/cookie-consent';
import { DeviceProvider } from '../providers/device/device';
import { LanguageProvider } from '../providers/language/language';
import { UserProvider } from '../providers/user/user';

import { ENV } from '../config/environment';
import { appTitle as globalAppTitle } from '../global';
import { lang } from '../pages/settings/settings.constants';

const _ = (a) => a;

export const loginWithNetlify = () => {
};

export const netlifyCurrentUser = () => {
  return false;
};

export const logoutWithNetlify = () => {
};

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements AfterViewInit {
  selectedTheme = 'picllary-theme';
  rootPage: any = EventFrontPage;
  pages: {title: string, id: string, component: any, status: any, divide: any}[];
  appTitle = globalAppTitle;
  @ViewChild(Nav) nav: Nav;

  private currentPageComponent: any;
  private loggedIn: boolean;

  private consentMessageFreePages = [
    EventFrontPage,
    DebugPage,
    AboutPage,
    LoginPage,
    SettingsPage,
  ];

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
    public lp: LanguageProvider,
    public popCtrl: PopoverController,
    public ccp: CookieConsentProvider,
    public renderer: Renderer2,
    public elRef: ElementRef,
  ) {
    this.initializeApp();
    const url = new URL(window.location.href);
    const urlParams = new HttpParams({ fromString: url.href.split('?')[1] });
    if (urlParams.get('key') && url.href.indexOf('verify-email') > -1) {
      platform.ready().then(() => {
        this.nav.setRoot(VerifyemailPage, { key: urlParams.get('key') });
      });
    } else if (urlParams.get('uid') && urlParams.get('token') && url.href.indexOf('reset-password') > -1) {
      platform.ready().then(() => {
        this.nav.setRoot(PasswordresetconfirmPage, { uid: urlParams.get('uid'), token: urlParams.get('token') });
      });
    }

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      const ionApp = this.renderer.parentNode(elRef.nativeElement);
      this.renderer.addClass(ionApp, this.selectedTheme);
      translate.setDefaultLang(lang.defaultLanguage);
      moment.locale(`${lang.defaultLanguage}-${lang.defaultLanguage}`);

      this.lp.getLanguage().then((res) => {
        if (res) {
          translate.use(res);
          lang.sysOptions.systemLanguage = res;
          moment.locale(`${res}-${res}`);
        } else {
          let language;
          if ((window as any).cordova) {
            this.globalization.getPreferredLanguage().then((result) => {
              language = this.getSuitableLanguage(result.value);
              translate.use(language);
              lang.sysOptions.systemLanguage = language;
            });
          } else {
            const browserLanguage = translate.getBrowserLang() || lang.defaultLanguage;
            language = this.getSuitableLanguage(browserLanguage);
            translate.use(language);
            lang.sysOptions.systemLanguage = language;
          }
          this.lp.saveLanguage(language);
        }
      });

      if (platform.is('cordova')) {
        statusBar.styleDefault();
        splashScreen.hide();
      }
      cache.setDefaultTTL(3600);
    });

    this.pages = [
      { title: _('Home'), id: 'event-front', component: EventFrontPage, status: false, divide: false },
      { title: _('Event'), id: 'event-list', component: EventListPage, status: false, divide: false },
      { title: _('Signup/Login'), id: 'login', component: LoginPage, status: false, divide: false },
      { title: _('Logout'), id: 'logout', component: LogoutPage, status: false, divide: false },
      { title: _('Settings'), id: 'settings', component: SettingsPage, status: false, divide: false },
      { title: _('About'), id: 'about', component: AboutPage, status: false, divide: false },
    ];

    if (ENV.PRODUCTION) {
      this.pages.forEach((el, l) => {
        if (el.id === 'debug') {
          this.pages.splice(l, 0);
        }
      });
    }

    events.subscribe('user:logout', () => {
      this.setStatus();
    });

    events.subscribe('user:login', (res) => {
      this.setStatus();
    });

    const securedPages = [
      'Logout',
      'Profile',
    ];

    this.pages.forEach((page) => {
      if (securedPages.indexOf(page.title) < 0) {
        page.status = true;
      }
    });
  }

  ngAfterViewInit() {
    this.nav.viewDidEnter.subscribe((ctrl) => this.updateCurrentPage(ctrl.component));

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component === LoginPage || page.component === SignupPage) {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);
    }
  }

  getSuitableLanguage(language) {
    language = language.substring(0, 2).toLowerCase();
    return lang.availableLanguages.some((x) => x.code === language) ? language : lang.defaultLanguage;
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

  updateCurrentPage(pageComponent) {
    this.currentPageComponent = pageComponent;
    this.showConsentIfRequired();
  }

  showConsentIfRequired() {
    if (this.currentPageComponent && this.loggedIn !== undefined) {
      if (this.consentMessageFreePages.indexOf(this.currentPageComponent) === -1) {
        if (!this.deviceStatus.isCordova && !this.loggedIn) {
          this.ccp.getConsent().then((consent) => {
            if (!consent && !this.ccp.requesting) {
              CookieConsentPage.present(this.popCtrl);
              this.ccp.requesting = true;
            }
          });
        }
      } else {
        this.events.publish('consent:forceClose');
      }
    }
  }

  setStatus() {
    return this.up.isAuthenticated().then((loggedIn) => {
      this.loggedIn = loggedIn;

      if (loggedIn) {
        this.pages.forEach((page) => {
          page.status = true;
          if (page.component === LoginPage || page.component === SignupPage) {
            page.status = false;
          }
        });
      } else {
        this.pages.forEach((page) => {
          if (page.component === LogoutPage || page.component === ProfilePage) {
            page.status = false;
          }
          if (page.component === LoginPage ||  page.component === SignupPage) {
            page.status = true;
          }
        });
      }

      this.showConsentIfRequired();
    });
  }

  socialSignIn() {
  }
}
