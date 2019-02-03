import * as path from 'path';
import { browser, by, element, ExpectedConditions } from 'protractor';

const EC = ExpectedConditions;

const imageOne = element(by.xpath("(//*[contains(@class, 'image-container')])[1]//img"));
const imageTwo = element(by.xpath("(//*[contains(@class, 'image-container')])[2]//img"));
const buyButton = element(by.id('buy'));
const downloadButton = element(by.id('download'));

export class EventPage {
  getFirstImageBtnText() {
    // the first image has not been purchased
    return browser.wait(
         EC.elementToBeClickable(imageOne),
         30000,
         'imageOne does not become clickable after 30 seconds')
      .then(() => imageOne.click())
      .then(() => browser.wait(
         EC.elementToBeClickable(buyButton),
         30000,
         'buyButton does not become clickable after 30 seconds'))
      .then(() => buyButton.getText())
      .then((text) => text);
  }

  getSecondImageBtnText() {
    // the second image has been purchased
    return browser.wait(
         EC.elementToBeClickable(imageTwo),
         30000,
         'imageTwo does not become clickable after 30 seconds')
      .then(() => imageTwo.click())
      .then(() => browser.wait(
         EC.elementToBeClickable(downloadButton),
         30000,
         'downloadButton does not become clickable after 30 seconds'))
      .then(() => downloadButton.getText())
      .then((text) => text);
  }

  navigateBack() {
    // navigation functionality is useful to navigate
    // back to event page from picture detail page
    return element(by.xpath('//image-viewer/ion-header/ion-navbar/button')).click();
  }

  getImagesCount() {
    return element.all(by.xpath('//event-square-image')).count();
  }

  selectImageToAdd() {
    const url = path.resolve(__dirname, '../assets/image-01.jpg');
    return element(by.xpath("//input[@type='file']")).sendKeys(url);
  }

  getPageTitle() {
    return element.all(by.css('.toolbar-title-md')).last();
  }

  getPageTitleText() {
    return this.getPageTitle().getText();
  }
}
