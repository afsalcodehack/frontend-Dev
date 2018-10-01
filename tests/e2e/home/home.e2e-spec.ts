import { HomePage } from './home.po';

describe('Home page', () => {
  let page: HomePage;

  beforeEach(() => {
    page = new HomePage();
    page.navigateTo();
  });

  it('should display welcome text', () => {
    page.getContentText().then((text) => {
      expect(text).toEqual('Hello World!');
    });
  });
});
