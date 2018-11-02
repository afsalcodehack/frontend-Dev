import { browser } from 'protractor';

import { EventCreatePage } from './eventcreate.po';
import { LoginPage } from '../login/login.po';
import { EventPage } from '../event/event.po';
import { EventListPage } from '../eventlist/eventlist.po';

describe('Event create page when logged in', () => {
  let page: EventCreatePage;
  let eventListPage: EventListPage;
  let eventPage: EventPage;
  let loginPage: LoginPage;

  beforeAll(() => {
    loginPage = new LoginPage();
    loginPage.navigateTo().then(() => {
      browser.sleep(5000).then(() => {
        loginPage.logIn();
      });
    });
  });

  beforeEach(() => {
    page = new EventCreatePage();
    page.navigateTo().then(() => {
      browser.sleep(3000);
    });
  });

  afterAll(() => {
    browser.get('/');
    loginPage.logOut();
  });

  it('should create a public event', () => {
    const name: string = 'testEvent';
    const price: number = 1.5;
    page.create(name, price).then(() => {
      eventListPage = new EventListPage();
      eventPage = new EventPage();
      browser.sleep(5000);
      eventListPage.openPublicEvent(name).then(() => {
        // should be able to buy the unpurchased picture
        eventPage.getFirstImageBtnText().then((text) => {
          expect(text).toEqual(`BUY (${price}$)`);
        });
        // should be able to navigate back to event page
        browser.sleep(3000);
        eventPage.navigateBack();
        browser.sleep(3000);
        // should be able to download the purchased picture
        eventPage.getSecondImageBtnText().then((text) => {
          expect(text).toEqual('VIEW FULL SIZE');
        });
      });
    });
  });

});
