import { browser, by, element, ExpectedConditions } from 'protractor';

import { EventPage } from '../event/event.po';
import { EventCreatePage } from '../eventcreate/eventcreate.po';
import { EventListPage } from '../eventlist/eventlist.po';
import { LoginPage } from '../login/login.po';

const EC = ExpectedConditions;
const eventFormLocator = by.css('#name');
const eventImageLocator = by.css('event-square-image');

describe('Uploaded image of an event', () => {
  let page: EventPage;
  let loginPage: LoginPage;
  let eventListPage: EventListPage;
  let eventCreatePage: EventCreatePage;

  beforeAll(() => {
    loginPage = new LoginPage();
    loginPage.navigateTo().then(() => {
      loginPage.logIn();
    });
  });

  beforeEach(() => {
    eventCreatePage = new EventCreatePage();
    eventListPage = new EventListPage();

    return eventCreatePage.navigateTo()
      .then(() => browser.wait(EC.visibilityOf(element(eventFormLocator)), 3000, 'Could not find new event form'))
      .then(() => eventCreatePage.create('test-event', 2))
      .then(() => eventListPage.openPublicEvent('test-event'));
  });

  it('should be added to event gallery', async () => {
    page = new EventPage();
    const expectedCount = page.getImagesCount().then((old) => old + 1);

    page.selectImageToAdd()
      .then(() => browser.wait(EC.visibilityOf(element.all(eventImageLocator).last()), 3000, 'Could not find event images'))
      .then(() => expect(page.getImagesCount()).toEqual(expectedCount));
  });

  afterAll(() => {
    browser.get('/');
    loginPage.logOut();
  });

});

describe('Open a secret event', () => {
  let eventListPage: EventListPage;
  const privateEventName = 'CEBIT';

  beforeEach(() => {
    eventListPage = new EventListPage();
    return eventListPage.navigateTo();
  });

  it('should see alert message', async () => {
    const alertMessage = 'Access to this event is protected by a secret key.';
    eventListPage.getPrivateEventAlertMessage(privateEventName)
      .then((text: string) => expect(text).toEqual(alertMessage));
  });

  it('should enter the event with correct secret', async () => {
    const correctSecret = 'hello';
    eventListPage.openPrivateEvent(privateEventName, correctSecret);
    const page = new EventPage();
    page.getPageTitleText().then((text: string) => {
      expect(text).toEqual(privateEventName);
    });
  });

  it('should not enter the event with wrong secret', async () => {
    const wrongSecret = 'wrong';
    eventListPage.openPrivateEvent(privateEventName, wrongSecret);
    const page = new EventPage();
    page.getPageTitleText().then((text: string) => {
      // stay on the eventlist page
      expect(text).toEqual('Event');
    });
  });
});
