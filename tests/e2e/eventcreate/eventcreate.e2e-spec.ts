import { browser } from 'protractor';

import { EventPage } from '../event/event.po';
import { EventListPage } from '../eventlist/eventlist.po';
import { LoginPage } from '../login/login.po';
import { EventCreatePage } from './eventcreate.po';

describe('Event create page when logged in', () => {
  let page: EventCreatePage;
  let eventListPage: EventListPage;
  let eventPage: EventPage;
  let loginPage: LoginPage;

  beforeAll(() => {
    loginPage = new LoginPage();
    loginPage.navigateTo().then(() => {
      loginPage.logIn();
    });
  });

  afterAll(() => {
    browser.get('/');
    loginPage.logOut();
  });

  beforeEach(() => {
    page = new EventCreatePage();
    eventListPage = new EventListPage();
    eventPage = new EventPage();
    page.navigateTo();
  });

  it('should create a public event', async () => {
    const name = 'testEvent';
    const price = 1.5;
    page.create(name, price).then(() => {
      eventListPage.openPublicEvent(name).then(() => {
        eventPage.getPageTitleText().then((text) => {
          expect(text).toEqual(name);
        });
      });
    });
  });

  it('should check the first image is buyable', async () => {
    const name = 'testEvent';
    const price = 1.5;
    page.create(name, price).then(() => {
      eventListPage.openPublicEvent(name).then(() => {
        eventPage.getFirstImageBtnText().then((text) => {
          expect(text).toEqual(`BUY (${price}$)`);
        });
      });
    });
  });

  it('should check the second image is downloadable', async () => {
    const name = 'testEvent';
    const price = 1.5;
    page.create(name, price).then(() => {
      eventListPage.openPublicEvent(name).then(() => {
        eventPage.getSecondImageBtnText().then((text) => {
          expect(text).toEqual('VIEW FULL SIZE');
        });
      });
    });
  });

});
