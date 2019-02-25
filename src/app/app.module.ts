import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CacheModule } from 'ionic-cache';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { IonicSelectableModule } from 'ionic-selectable';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { Globalization } from '@ionic-native/globalization';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Transfer } from '@ionic-native/transfer';

import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';

import { ShareModule } from '@ngx-share/core';
import { MomentModule } from 'ngx-moment';
import { NgxStripeModule } from 'ngx-stripe';

// used to create fake backend
import { fakeBackendProvider } from '../providers/backendless';

// used to inject Accept-Language header for backend translations;
import { translationProvider } from '../providers/acceptlanguage';

import { MyApp } from './app.component';
import { authHttpServiceFactory } from './authHttpServiceFactory';

import { ENV } from '../config/environment';

import { AboutPage } from '../pages/about/about';
import { CookieConsentPage } from '../pages/cookieconsent/cookieconsent';
import { DebugPage } from '../pages/debug/debug';
import { EventPage } from '../pages/event/event';
import { EventCreatePage } from '../pages/eventcreate/eventcreate';
import { EventFrontPage } from '../pages/eventfront/eventfront';
import { EventListPage } from '../pages/eventlist/eventlist';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { NotFoundPage } from '../pages/not-found/not-found';
import { PasswordresetPage } from '../pages/passwordreset/passwordreset';
import { PasswordresetconfirmPage } from '../pages/passwordresetconfirm/passwordresetconfirm';
import { PaymentPage } from '../pages/payment/payment';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TandcPage } from '../pages/tandc/tandc';
import { VerifyemailPage } from '../pages/verifyemail/verifyemail';
import { WelcomePage } from '../pages/welcome/welcome';

import { CookieConsentProvider } from '../providers/cookie-consent/cookie-consent';
import { CurrencyExchangeProvider } from '../providers/cur-exchange/cur-exchange';
import { DeviceProvider } from '../providers/device/device';
import { EventProvider } from '../providers/event/event';
import { I18nAlertProvider } from '../providers/i18n-alert/i18n-alert';
import { ImageUploadProvider } from '../providers/image-upload/image-upload';
import { LanguageProvider } from '../providers/language/language';
import { PageLocationProvider } from '../providers/page-location/page-location';
import { Script, ScriptProvider } from '../providers/scripts/scripts';
import { StripeProvider } from '../providers/stripe/stripe';
import { ThemeProvider } from '../providers/theme/theme';
import { UserProvider } from '../providers/user/user';

import { AppContentComponent } from '../components/app-content/app-content';
import { EventSquareImageComponent } from '../components/event-square-image/event-square-image';
import { LocaleDatetimeComponent } from '../components/locale-datetime/locale-datetime';
import { SquareImageComponent } from '../components/square-image/square-image';
import { MapToIterablePipe } from '../pipes/map-to-iterable/map-to-iterable';
import { FilterByValuePipe } from './../pipes/filter-by-value/filter-by-value';

const deepLinkConfig = {
  // All custom deep links goes here.
  links: [
    { component: EventFrontPage, name: 'root', segment: '' },
    { component: EventFrontPage, name: 'event-front', segment: 'event-front' },
    { component: EventPage, name: 'event', segment: 'event/:id' },
    { component: EventCreatePage, name: 'event-create', segment: 'event/create' },
    { component: EventCreatePage, name: 'event-create', segment: 'event/edit/:id' },
    { component: EventListPage, name: 'event-list', segment: 'event' },
    { component: PaymentPage, name: 'payment', segment: 'payment' },
    { component: AboutPage, name: 'about', segment: 'about' },
    { component: HomePage, name: 'home', segment: 'home' },
    { component: SettingsPage, name: 'settings', segment: 'settings' },
    { component: LoginPage, name: 'login', segment: 'login' },
    { component: SignupPage, name: 'signup', segment: 'signup' },
    { component: ProfilePage, name: 'profile', segment: 'profile' },
    { component: ProfilePage, name: 'profile', segment: 'users/profile/:id' },
    { component: TandcPage, name: 'tandc', segment: 'tandc' },
    { component: NotFoundPage, name: 'not-found', segment: '*' },
    { component: CookieConsentPage, name: 'cookie-consent', segment: 'cookie-consent' },
    { component: DebugPage, name: 'debug', segment: 'debug' },
  ],
};

export const createTranslateLoader = (http: Http) => {
  return new TranslateStaticLoader(http, '/assets/i18n', '.json');
};

export const ScriptStore: Script[] = [
];

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    CookieConsentPage,
    DebugPage,
    EventPage,
    EventCreatePage,
    EventFrontPage,
    EventListPage,
    HomePage,
    LoginPage,
    LogoutPage,
    NotFoundPage,
    PasswordresetPage,
    PasswordresetconfirmPage,
    PaymentPage,
    ProfilePage,
    SettingsPage,
    SignupPage,
    TandcPage,
    VerifyemailPage,
    WelcomePage,
    AppContentComponent,
    SquareImageComponent,
    EventSquareImageComponent,
    LocaleDatetimeComponent,
    MapToIterablePipe,
    FilterByValuePipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      locationStrategy: ENV.LOCATION_STRATEGY,
    }, deepLinkConfig),
    CacheModule.forRoot(),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http],
    }),
    IonicStorageModule.forRoot({
      driverOrder: ['localstorage', 'websql', 'sqlite', 'indexeddb'],
    }),
    IonicImageViewerModule,
    IonicSelectableModule,
    NgxStripeModule.forRoot(ENV.STRIPE_KEY),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: authHttpServiceFactory,
        deps: [Storage],
      },
    }),
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    ShareModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    CookieConsentPage,
    DebugPage,
    EventPage,
    EventCreatePage,
    EventFrontPage,
    EventListPage,
    HomePage,
    LoginPage,
    LogoutPage,
    NotFoundPage,
    PasswordresetPage,
    PasswordresetconfirmPage,
    PaymentPage,
    ProfilePage,
    SettingsPage,
    SignupPage,
    TandcPage,
    VerifyemailPage,
    WelcomePage,
  ],
  providers: [
    CookieConsentProvider,
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler,
    },
    CurrencyExchangeProvider,
    UserProvider,
    LanguageProvider,
    ThemeProvider,
    Globalization,
    DeviceProvider,
    ScriptProvider,
    File,
    Transfer,
    Camera,
    Device,
    I18nAlertProvider,
    ImageUploadProvider,
    fakeBackendProvider,
    translationProvider,
    PageLocationProvider,
    EventProvider,
    StripeProvider,
  ],
})
export class AppModule {
  public static gaEnabled = false;
}

export const nonMenuPages = {
  EventPage,
  EventCreatePage,
  PaymentPage,
  VerifyemailPage,
  HomePage,
  SignupPage,
  WelcomePage,
  PasswordresetPage,
  PasswordresetconfirmPage,
  TandcPage,
  NotFoundPage,
  CookieConsentPage,
  DebugPage,
};
