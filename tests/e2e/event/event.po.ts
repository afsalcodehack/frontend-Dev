import { by, element } from 'protractor';

export class EventPage {
  getFirstImageBtnText() {
    // the first image has not been purchased
    return element.all(by.css('.image-container')).first().click()
      .then(() => element(by.id('buy')).getText())
      .then((text) => text);
  }

  getSecondImageBtnText() {
    // the second image has been purchased
    return element.all(by.css('.image-container')).get(1).click()
      .then(() => element(by.id('download')).getText())
      .then((text) => text);
  }

  navigateBack() {
    // navigation functionality is useful to navigate
    // back to event page from picture detail page
    return element(by.xpath('//image-viewer/ion-header/ion-navbar/button')).click();
  }
}
