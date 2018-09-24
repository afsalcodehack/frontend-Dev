import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Http, HttpModule } from '@angular/http';
import { ENV } from '../config/environment';

// used to create fake backend
import { fakeBackendProvider } from '../providers/backendless';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { ServicePage } from '../pages/service/service';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage} from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { LogoutPage } from '../pages/logout/logout';
import { WelcomePage} from '../pages/welcome/welcome';
import { PasswordresetPage } from '../pages/passwordreset/passwordreset';
import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { TandcPage } from '../pages/tandc/tandc';
import { NotFoundPage } from '../pages/not-found/not-found';
import { ProductPage } from '../pages/product/product';
import { MapPage } from '../pages/map/map';
import { EventPage } from '../pages/event/event';
import { EventListPage } from '../pages/eventlist/eventlist';
import { EventCreatePage } from '../pages/eventcreate/eventcreate';
import { PaymentPage } from '../pages/payment/payment';


import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CacheModule } from "ionic-cache";
import { CurrencyExchangeProvider } from '../providers/cur-exchange/cur-exchange';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { Globalization } from '@ionic-native/globalization';
import { UserProvider } from '../providers/user/user';
import { HttpClientModule } from '@angular/common/http'
import { LanguageProvider } from '../providers/language/language';
import { DeviceProvider } from '../providers/device/device';
import { Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { PasswordresetconfirmPage } from "../pages/passwordresetconfirm/passwordresetconfirm";
import { ImageUploadProvider } from '../providers/image-upload/image-upload';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { Camera } from '@ionic-native/camera';
import { EventProvider } from '../providers/event/event';
import { NgxStripeModule } from 'ngx-stripe';
import { StripeProvider } from '../providers/stripe/stripe';
import { ProductProvider } from '../providers/product/product';


export const deepLinkConfig = {
  // All custom deep links goes here.
  links: [
    { component: HomePage, name: "home", segment: ""},
    { component: TandcPage, name: "tandc", segment: "tandc"},
    { component: NotFoundPage, name: "*", segment: ":**"},
    { component: LoginPage, name: "login", segment: "login"},
    { component: SignupPage, name: "signup", segment: "signup"},
    { component: ServicePage, name: "service", segment: "service"},
    { component: SettingsPage, name: "settings", segment: "settings"},
    { component: SearchPage, name: "search", segment: "search"},
    { component: AboutPage, name: "about", segment: "about"},
    { component: ProductPage, name: "product", segment: "product"},
    { component: MapPage, name: "map", segment: "map"},
    { component: EventListPage, name: "event", segment: "event"},
    { component: EventCreatePage, name: "event/create", segment: "event/create"},
    { component: EventPage, name: "event/:id", segment: "event/:id"},
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
    SearchPage,
    ProfilePage,
    TandcPage,
    NotFoundPage,
    ProductPage,
    MapPage,
    EventPage,
    EventListPage,
    EventCreatePage,
    PaymentPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {}, deepLinkConfig),
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
    SearchPage,
    ProfilePage,
    TandcPage,
    NotFoundPage,
    ProductPage,
    MapPage,
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
    Geolocation,
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
