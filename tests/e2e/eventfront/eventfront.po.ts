import { browser, by, element, ExpectedConditions } from 'protractor';

const EC = ExpectedConditions;
const toolbarTitleLocator = by.css('.toolbar-title-md');

export class EventFrontPage {
  navigateTo() {
    browser.get('/event-front');
    return browser.wait(EC.visibilityOf(element(toolbarTitleLocator)), 3000, 'Event front page did not load in time');
  }

  getButtons() {
    return element.all(by.css('.ion-content-custom')).first();
  }

  getFirstButton() {
    return this.getButtons().all(by.css('.button-inner')).first();
  }

  getSecondButton() {
    return this.getButtons().all(by.css('.button-inner')).get(1);  // Ignore ESLintBear (protractor/no-repetitive-locators)
  }

  getPageTitleText() {
    return element.all(toolbarTitleLocator).last().getText();
  }
}
