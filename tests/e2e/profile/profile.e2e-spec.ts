import { browser, by, element, ExpectedConditions } from 'protractor';

import { LoginPage } from '../login/login.po';
import { ProfilePage } from './profile.po';

const EC = ExpectedConditions;
const profileCardLocator = by.css('.profile-card-image');

describe('Profile picture', () => {
  let loginPage: LoginPage;
  let page: ProfilePage;

  beforeAll(() => {
    loginPage = new LoginPage();
    loginPage.navigateTo().then(() => {
      loginPage.logIn();
    });
  });

  beforeEach(() => {
    page = new ProfilePage();
    page.navigateTo();
  });

  it('should update when new profile picture is uploaded', async () => {
    let oldSrc: string;
    page = new ProfilePage();

    page.getCurrentProfilePicture()
      .then((old) => oldSrc = old)
      .then(() => page.selectProfilePicture())
      .then(() => browser.wait(EC.visibilityOf(element(profileCardLocator)), 3000, 'Could not locate profile picture'))
      .then(() => page.getCurrentProfilePicture())
      .then((newSrc) => expect(newSrc).not.toBe(oldSrc));
  });

});
