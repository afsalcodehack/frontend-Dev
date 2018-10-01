import { EventFrontPage } from './eventfront.po';
import { LoginPage } from '../login/login.po';
import { browser } from 'protractor';

describe('Event front page when not logged in', () => {
  let page: EventFrontPage;

  beforeEach(() => {
    page = new EventFrontPage();
    page.navigateTo().then(() => {
      browser.sleep(3000);
    });
  });

  it('should display customer/photographer buttons', () => {
    page.getFirstButton().getText().then((text) => expect(text).toEqual('CUSTOMER'));
    page.getSecondButton().getText().then((text) => expect(text).toEqual('PHOTOGRAPHER'));
  });

  it('should navigate to event list page when customer button clicked', () => {
    page.getFirstButton().click().then(() => {
      browser.sleep(3000);
      page.getPageTitleText().then((text) => expect(text).toEqual('Event'));
    });
  });

  it('should navigate to login page when photographer button clicked', () => {
    page.getSecondButton().click().then(() => {
      browser.sleep(3000);
      page.getPageTitleText().then((text) => expect(text).toEqual('Login'));
    });
  });
});

describe('Event front page when logged in', () => {
  let page: EventFrontPage;
  let loginPage: LoginPage;

  beforeAll(() => {
    loginPage = new LoginPage();
    loginPage.navigateTo().then(() => {
      const email = 'alice@example.com';
      const password = '123456';
      loginPage.fillCredentials(email, password).then(() => {
        browser.sleep(5000);
      });
    });
  });

  beforeEach(() => {
    page = new EventFrontPage();
    page.navigateTo().then(() => {
      browser.sleep(3000);
    });
  });

  afterAll(() => {
    loginPage.logOut();
  });

  it('should display your events/new events buttons', () => {
    page.getFirstButton().getText().then((text) => expect(text).toEqual('YOUR EVENTS'));
    page.getSecondButton().getText().then((text) => expect(text).toEqual('NEW EVENTS'));
  });

  it('should navigate to event list page when your events button clicked', () => {
    page.getFirstButton().click().then(() => {
      browser.sleep(3000);
      page.getPageTitleText().then((text) => expect(text).toEqual('Event'));
    });
  });

  it('should navigate to new event page when new events button clicked', () => {
    page.getSecondButton().click().then(() => {
      browser.sleep(3000);
      page.getPageTitleText().then((text) => expect(text).toEqual('Create Event'));
    });
  });
});
