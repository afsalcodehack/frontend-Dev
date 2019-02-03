import { browser, by, element, ExpectedConditions } from 'protractor';

import { LoginPage } from './login.po';

const EC = ExpectedConditions;
const loginFormLocator = by.css('#email');

describe('Login page', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo();
  });

  it('should not login with wrong credentials', async () => {
    const email = 'alice@example.com';
    const password = 'wrong_password';
    page.fillCredentials(email, password).then(() => {
      browser.wait(EC.visibilityOf(element(loginFormLocator)), 5000, 'Could not locate login form');
      // stay on login page
      page.getPageTitleText().then((text) => expect(text).toEqual('Login'));
      // TODO: error information needs to be checked, as long as
      // https://gitlab.com/viperdev/template/ionic/issues/46 is solved.
    });
  });

  it('should login successfully with valid credentials', async () => {
    const email = 'alice@example.com';
    const password = '123456';
    page.fillCredentials(email, password).then(() => {
      browser.wait(EC.invisibilityOf(element(loginFormLocator)), 5000, 'Login form should not be present');
      // redirected to home page, which may be different on each site
      page.getPageTitleText().then((text) => expect(text).not.toEqual('Login'));
      // need to log out to clear states
      page.logOut();
    });
  });

});
