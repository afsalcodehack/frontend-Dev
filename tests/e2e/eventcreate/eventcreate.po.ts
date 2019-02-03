import { browser, by, element, ExpectedConditions } from 'protractor';

const EC = ExpectedConditions;
const eventFormLocator = by.css('#name');

export class EventCreatePage {
  navigateTo() {
    browser.get('/event/create');
    return browser.wait(
      EC.textToBePresentInElement(this.getPageTitle(), 'Create Event'),
      30000,
      'open event create page fails after 30 seconds',
    ).then(() => {
      browser.wait(EC.visibilityOf(element(eventFormLocator)), 3000, 'Could not confirm event page loaded');
    });
  }

  fillInfo(name, price, secretKey = '', isPublic = true) {
    element(by.css('input[type="text"]')).sendKeys(name);
    element(by.css('input[type="number"]')).sendKeys(price);
    if (secretKey) {
      element(by.css('input[type="password"]')).sendKeys(secretKey);
    }
    if (isPublic) {
      element(by.css('button[role="checkbox"]')).click();
    }
    const submitButton = element(by.css('button[type="submit"]'));
    browser.wait(
      EC.elementToBeClickable(submitButton),
      30000,
      'submit button does not become clickable within 30 seconds',
    );
    return submitButton.click();
  }

  create(name, price, secretKey = '', isPublic = true) {
    return this.fillInfo(name, price, secretKey, isPublic).then(() => {
      const pageTitle = this.getPageTitle();
      // wait until create succeeds (redirects to event list page)
      browser.wait(
        EC.not(EC.textToBePresentInElement(pageTitle, 'Create Event')),
        60000,
        'create event fails within 60 seconds',
      );
    });
  }

  getPageTitle() {
    return element.all(by.css('.toolbar-title-md')).last();
  }

  getPageTitleText() {
    return this.getPageTitle().getText();
  }
}
