import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CacheModule } from 'ionic-cache';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { IonicStorageModule, Storage } from '@ionic/storage';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Globalization } from '@ionic-native/globalization';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Transfer } from '@ionic-native/transfer';

import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';

import { NgxStripeModule } from 'ngx-stripe';

// used to create fake backend
import { fakeBackendProvider } from '../providers/backendless';

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
import { ProductPage } from '../pages/product/product';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TandcPage } from '../pages/tandc/tandc';
import { WelcomePage } from '../pages/welcome/welcome';

import { CookieConsentProvider } from '../providers/cookie-consent/cookie-consent';
import { CurrencyExchangeProvider } from '../providers/cur-exchange/cur-exchange';
import { DeviceProvider } from '../providers/device/device';
import { EventProvider } from '../providers/event/event';
import { ImageUploadProvider } from '../providers/image-upload/image-upload';
import { LanguageProvider } from '../providers/language/language';
import { PageLocationProvider } from '../providers/page-location/page-location';
import { ProductProvider } from '../providers/product/product';
import { StripeProvider } from '../providers/stripe/stripe';
import { ThemeProvider } from '../providers/theme/theme';
import { UserProvider } from '../providers/user/user';

import { AppContentComponent } from '../components/app-content/app-content';
import { SquareImageComponent } from '../components/square-image/square-image';
import { MapToIterablePipe } from '../pipes/map-to-iterable/map-to-iterable';

const deepLinkConfig = {
  // All custom deep links goes here.
  links: [
    { component: EventFrontPage, name: 'root', segment: '' },
    { component: EventFrontPage, name: 'event-front', segment: 'event-front' },
    { component: AboutPage, name: 'about', segment: 'about' },
    { component: HomePage, name: 'home', segment: 'home' },
    { component: SettingsPage, name: 'settings', segment: 'settings' },
    { component: SignupPage, name: 'signup', segment: 'signup' },
    { component: ProfilePage, name: 'profile', segment: 'profile' },
    { component: ProfilePage, name: 'profile', segment: 'users/profile/:id' },
    { component: TandcPage, name: 'tandc', segment: 'tandc' },
    { component: NotFoundPage, name: 'not-found', segment: '*' },
    { component: ProductPage, name: 'product', segment: 'product' },
    { component: EventPage, name: 'event', segment: 'event/:id' },
    { component: EventListPage, name: 'event-list', segment: 'event' },
    { component: EventCreatePage, name: 'event-create', segment: 'event/create' },
    { component: EventCreatePage, name: 'event-create', segment: 'event/edit/:id' },
    { component: PaymentPage, name: 'payment', segment: 'payment' },
    { component: DebugPage, name: 'debug', segment: 'debug' },
  ],
};

export const createTranslateLoader = (http: Http) => {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
};

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
    ProductPage,
    ProfilePage,
    SettingsPage,
    SignupPage,
    TandcPage,
    WelcomePage,
    AppContentComponent,
    SquareImageComponent,
    MapToIterablePipe,
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
    IonicStorageModule.forRoot(),
    IonicImageViewerModule,
    NgxStripeModule.forRoot(ENV.STRIPE_KEY),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: authHttpServiceFactory,
        deps: [Storage],
      },
    }),
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
    ProductPage,
    ProfilePage,
    SettingsPage,
    SignupPage,
    TandcPage,
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
    File,
    Transfer,
    Camera,
    ImageUploadProvider,
    fakeBackendProvider,
    PageLocationProvider,
    EventProvider,
    StripeProvider,
    ProductProvider,
  ],
})
export class AppModule {
  public static gaEnabled = false;
}
