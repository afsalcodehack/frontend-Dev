import { browser, by, element } from 'protractor';

export class EventFrontPage {
  navigateTo() {
    return browser.get('/#/event-front');
  }

  getButtons() {
    return element.all(by.css('.ion-content-custom')).first();
  }

  getFirstButton() {
    return this.getButtons().all(by.css('.button-inner')).first();
  }

  getSecondButton() {
    return this.getButtons().all(by.css('.button-inner')).get(1);
  }

  getPageTitleText() {
    return element.all(by.css('.toolbar-title-md')).last().getText();
  }
}
