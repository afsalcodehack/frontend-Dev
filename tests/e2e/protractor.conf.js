// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '**/*.e2e-spec.ts',
  ],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--headless', '--no-sandbox', 'window-size=1200,1100'],
    },
  },
  directConnect: true,
  baseUrl: 'http://localhost:8100/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {},
  },
  onPrepare() {
    require('ts-node').register({
      project: 'tsconfig.json',
    });

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
        }
      })
    );

    /* Provide cookie consent */
    const EC = ExpectedConditions;
    const okConsent = element(by.xpath('//page-cookie-consent/ion-grid/ion-row[2]/ion-col/button'));

    return browser.get('/#/event')
      .then(() => browser.sleep(1000))
      .then(() => browser.wait(EC.elementToBeClickable(okConsent), 6000))
      .then(() => okConsent.click())
      .then(() => browser.sleep(1000));
  }
};
