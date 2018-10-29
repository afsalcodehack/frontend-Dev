import { browser, by, element, ExpectedConditions } from 'protractor';

const EC = ExpectedConditions;

export class EventListPage {
  navigateTo() {
    browser.get('/#/event');
    return browser.wait(
      EC.textToBePresentInElement(this.getPageTitle(), 'Event'),
      30000,
      'open event list page fails after 30 seconds'
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
        'open event detail page fails after 30 seconds'
      );
    });
  }
}
