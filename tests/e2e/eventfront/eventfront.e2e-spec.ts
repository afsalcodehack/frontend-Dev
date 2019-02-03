import { browser, by, element, ExpectedConditions } from 'protractor';

import { LoginPage } from '../login/login.po';
import { EventFrontPage } from './eventfront.po';

const EC = ExpectedConditions;
const eventListLocator = by.css('ion-list');
const loginFormLocator = by.css('input[type="email"]');
const eventFormLocator = by.css('#name');

describe('Event front page when not logged in', () => {
  let page: EventFrontPage;

  beforeEach(() => {
    page = new EventFrontPage();
    page.navigateTo();
  });

  it('should display customer/photographer buttons', async () => {
    page.getFirstButton().getText().then((text) => expect(text).toEqual('CUSTOMER'));
    page.getSecondButton().getText().then((text) => expect(text).toEqual('PHOTOGRAPHER'));
  });

  it('should navigate to event list page when customer button clicked', async () => {
    page.getFirstButton().click().then(() => {
      browser.wait(EC.visibilityOf(element(eventListLocator)), 3000, 'Could not find event list');
      page.getPageTitleText().then((text) => expect(text).toEqual('Event'));
    });
  });

  it('should navigate to login page when photographer button clicked', async () => {
    page.getSecondButton().click().then(() => {
      browser.wait(EC.visibilityOf(element(loginFormLocator)), 3000, 'Could not find login form');
      page.getPageTitleText().then((text) => expect(text).toEqual('Login'));
    });
  });
});

describe('Event front page when logged in', () => {
  let page: EventFrontPage;
  let loginPage: LoginPage;
  let defaultInterval: number;

  beforeAll(() => {
    defaultInterval = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    // increase DEFAULT_TIMEOUT_INTERVAL to 120 seconds
    // because login takes some time.
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000;
    loginPage = new LoginPage();
    loginPage.navigateTo().then(() => {
      loginPage.logIn();
    });
  });

  beforeEach(() => {
    page = new EventFrontPage();
    page.navigateTo();
  });

  afterAll(() => {
    loginPage.logOut();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = defaultInterval;
  });

  it('should display your events/new events buttons', async () => {
    page.getFirstButton().getText().then((text) => expect(text).toEqual('YOUR EVENTS'));
    page.getSecondButton().getText().then((text) => expect(text).toEqual('NEW EVENTS'));
  });

  it('should navigate to event list page when your events button clicked', async () => {
    page.getFirstButton().click().then(() => {
      browser.wait(EC.visibilityOf(element(eventListLocator)), 3000, 'Could not find event list');
      page.getPageTitleText().then((text) => expect(text).toEqual('Event'));
    });
  });

  it('should navigate to new event page when new events button clicked', async () => {
    page.getSecondButton().click().then(() => {
      browser.wait(EC.visibilityOf(element(eventFormLocator)), 3000, 'Could not find new event form');
      page.getPageTitleText().then((text) => expect(text).toEqual('Create Event'));
    });
  });
});
