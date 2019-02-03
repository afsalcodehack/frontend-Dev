import { browser, by, element, ExpectedConditions } from 'protractor';

const EC = ExpectedConditions;

export class EventListPage {
  navigateTo() {
    browser.get('/event');
    return browser.wait(
      EC.textToBePresentInElement(this.getPageTitle(), 'Event'),
      30000,
      'open event list page fails after 30 seconds',
    );
  }

  getPageTitle() {
    return element.all(by.css('.toolbar-title-md')).last();
  }

  getPageTitleText() {
    return this.getPageTitle().getText();
  }

  openPublicEvent(name: string) {
    return element(by.cssContainingText('button', name)).click().then(() => {
      return browser.wait(
        EC.textToBePresentInElement(this.getPageTitle(), name),
        30000,
        'open event detail page fails after 30 seconds',
      );
    });
  }

  selectPrivateEvent(name: string) {
    return element(by.cssContainingText('button', name)).click();
  }

  getPrivateEventAlertMessage(name: string) {
    return this.selectPrivateEvent(name).then(() => {
      // ionic uses .alert-message for alert message by default
      return element(by.xpath('//ion-alert//div[@class="alert-message"]')).getText();
    });
  }

  openPrivateEvent(name: string, secret: string) {
    return this.selectPrivateEvent(name).then(() => {
      element(by.css('input[type="password"]')).sendKeys(secret);
      browser.sleep(5000); // Ignore ESLintBear (protractor/no-browser-sleep)
      const submitButton = element(by.css('.secret-submit'));
      return browser.wait(
        EC.elementToBeClickable(submitButton),
        30000,
        'submit button does not become clickable within 30 seconds',
      ).then(() => submitButton.click());
    });
  }
}
