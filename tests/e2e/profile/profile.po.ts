import * as path from 'path';
import { browser, by, element } from 'protractor';

export class ProfilePage {
  navigateTo() {
    return browser.get('/profile');
  }

  getCurrentProfilePicture() {
    return element(by.xpath("//div[@class='profile-card__image']/img")).getAttribute('src');
  }

  selectProfilePicture() {
    const url = path.resolve(__dirname, '../assets/image-01.jpg');
    return element(by.xpath("//input[@type='file']")).sendKeys(url);
  }
}
