import { LoginPage } from './login.po';
import { browser } from 'protractor';

describe('Login page', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
    page.navigateTo().then(() => {
      browser.sleep(5000);
    });
  });

  it('should not login with wrong credentials', () => {
    const email = 'alice@example.com';
    const password = 'wrong_password';
    page.fillCredentials(email, password).then(() => {
      browser.sleep(5000);
      // stay on login page
      page.getPageTitleText().then((text) => expect(text).toEqual('Login'));
      // TODO: error information needs to be checked, as long as
      // https://gitlab.com/viperdev/template/ionic/issues/46 is solved.
    });
  });

  it('should login successfully with valid credentials', () => {
    const email = 'alice@example.com';
    const password = '123456';
    page.fillCredentials(email, password).then(() => {
      browser.sleep(5000);
      // redirected to home page, which may be different on each site
      page.getPageTitleText().then((text) => expect(text).not.toEqual('Login'));
    });
  });

});
