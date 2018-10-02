import { browser, by, element, ExpectedConditions } from 'protractor';

const EC = ExpectedConditions;

export class LoginPage {
  navigateTo() {
    browser.get('/');
    element(by.css('.navbar')).element(by.id('login')).click();
    // wait until redirect to login page successfully
    const pageTitle = this.getPageTitle();
    return browser.wait(
      EC.textToBePresentInElement(pageTitle, 'Login'),
      30000,
      'redirect to login page fails after 30 seconds'
    );
  }

  fillCredentials(email, password) {
    element(by.css('input[type="email"]')).sendKeys(email);
    element(by.css('input[type="password"]')).sendKeys(password);
    const loginButton = element(by.css('button[type="submit"]'));
    browser.wait(
      EC.elementToBeClickable(loginButton),
      30000,
      'login button does not become clickable within 30 seconds'
    );
    return loginButton.click();
  }

  getPageTitle() {
    return element.all(by.css('.toolbar-title-md')).last();
  }

  getPageTitleText() {
    return this.getPageTitle().getText();
  }

  logIn() {
    const email = 'alice@example.com';
    const password = '123456';
    return this.fillCredentials(email, password).then(() => {
      const pageTitle = this.getPageTitle();
      // wait until login succeeds (redirects to some other page rather than login page)
      browser.wait(
        EC.not(EC.textToBePresentInElement(pageTitle, 'Login')),
        60000,
        'login fails within 60 seconds'
      );
    });
  }

  logOut() {
    return element(by.css('.navbar')).element(by.id('logout')).click();
  }
}
