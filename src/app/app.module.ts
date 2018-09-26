import { HttpClientModule } from '@angular/common/http'
import { ErrorHandler, NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AuthConfig, AuthHttp } from 'angular2-jwt';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { CacheModule } from 'ionic-cache';

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

import { ENV } from '../config/environment';

import { AboutPage } from '../pages/about/about';
import { EventPage } from '../pages/event/event';
import { EventCreatePage } from '../pages/eventcreate/eventcreate';
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
import { ServicePage } from '../pages/service/service';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TandcPage } from '../pages/tandc/tandc';
import { WelcomePage } from '../pages/welcome/welcome';

import { CurrencyExchangeProvider } from '../providers/cur-exchange/cur-exchange';
import { DeviceProvider } from '../providers/device/device';
import { EventProvider } from '../providers/event/event';
import { ImageUploadProvider } from '../providers/image-upload/image-upload';
import { LanguageProvider } from '../providers/language/language';
import { ProductProvider } from '../providers/product/product';
import { StripeProvider } from '../providers/stripe/stripe';
import { UserProvider } from '../providers/user/user';

import { AppContentComponent } from '../components/app-content/app-content';

const deepLinkConfig = {
  // All custom deep links goes here.
  links: [
    { component: HomePage, name: "root", segment: ""},
    { component: HomePage, name: "home", segment: "home"},
    { component: AboutPage, name: "about", segment: "about"},
    { component: ServicePage, name: "service", segment: "service"},
    { component: SettingsPage, name: "settings", segment: "settings"},
    { component: SignupPage, name: "signup", segment: "signup"},
    { component: ProfilePage, name: "profile", segment: "profile"},
    { component: ProfilePage, name: "profile", segment: "users/profile/:id"},
    { component: TandcPage, name: "tandc", segment: "tandc"},
    { component: NotFoundPage, name: "not-found", segment: "*"},
    { component: ProductPage, name: "product", segment: "product"},
    { component: EventPage, name: "event", segment: "event/:id"},
    { component: EventListPage, name: "event-list", segment: "event"},
    { component: EventCreatePage, name: "event-create", segment: "event/create"},
    { component: PaymentPage, name: "payment", segment: "payment"},
  ]
};

let storage = new Storage({});

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'JWT',
    noJwtError: true,
    tokenName: 'token',
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('token').then((token: string) => token)),
  }), http);
}


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    ServicePage,
    SettingsPage,
    LoginPage,
    SignupPage,
    LogoutPage,
    WelcomePage,
    PasswordresetPage,
    PasswordresetconfirmPage,
    ProfilePage,
    TandcPage,
    NotFoundPage,
    ProductPage,
    EventPage,
    EventListPage,
    EventCreatePage,
    PaymentPage,
    AppContentComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      locationStrategy: 'path',
    }, deepLinkConfig),
    CacheModule.forRoot(),
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    IonicStorageModule.forRoot(),
    NgxStripeModule.forRoot(ENV.STRIPE_KEY),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    ServicePage,
    SettingsPage,
    LoginPage,
    SignupPage,
    LogoutPage,
    WelcomePage,
    PasswordresetPage,
    PasswordresetconfirmPage,
    ProfilePage,
    TandcPage,
    NotFoundPage,
    ProductPage,
    EventPage,
    EventListPage,
    EventCreatePage,
    PaymentPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CurrencyExchangeProvider,
    UserProvider,
    LanguageProvider,
    Globalization,
    DeviceProvider,
    {provide: AuthHttp, useFactory: getAuthHttp, deps: [Http]},
    File,
    Transfer,
    Camera,
    ImageUploadProvider,
    fakeBackendProvider,
    EventProvider,
    StripeProvider,
    ProductProvider,
  ]
})
export class AppModule {}

export function createTranslateLoader (http: Http) {
  return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}
