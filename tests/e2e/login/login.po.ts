import { browser, by, element } from 'protractor';

export class LoginPage {
  navigateTo() {
    browser.get('/');
    return element(by.css('.navbar')).element(by.id('login')).click();
  }

  fillCredentials(email, password) {
    element(by.css('input[type="email"]')).sendKeys(email);
    element(by.css('input[type="password"]')).sendKeys(password);
    browser.sleep(5000);
    return element(by.css('button[type="submit"]')).click();
  }

  getPageTitleText() {
    return element.all(by.css('.toolbar-title-md')).last().getText();
  }

  logOut() {
    return element(by.css('.navbar')).element(by.id('logout')).click();
  }
}
