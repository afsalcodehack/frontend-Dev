import { browser, by, element } from 'protractor';

export class HomePage {
  navigateTo() {
    return browser.get('/home');
  }

  getContentText() {
    return element.all(by.css('.ion-content-custom')).first().getText();
  }
}
