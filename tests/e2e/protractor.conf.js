// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

const promiseRetry = require('promise-retry');
const rp = require('request-promise-any');

function waitForHttp(url, name, retries) {
  return promiseRetry(function (retry, number) {
    console.log(`protractor: attempt ${number} to reach ${name} ...`);
      return rp(url)
        .then((body) => {
          console.log(`protractor: .. ${name} online.`);
        })
        .catch((err) => {
          console.log(`protractor: connection failed: ${err.message}`);
          retry(err);
        });
  }, retries)
}

const cookieConsentPage = 'signup';

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '**/*.e2e-spec.ts',
  ],
  plugins: [{
    package: 'protractor-screenshoter-plugin',
    screenshotPath: './e2e_report/',
    screenshotOnExpect: 'failure+success',
    screenshotOnSpec: 'failure+success',
    withLogs: true,
    writeReportFreq: 'asap',
    imageToAscii: 'none',
    clearFoldersBeforeTest: true,
  }],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      args: ['--headless', '--no-sandbox', 'window-size=1200,1100'],
    },
    loggingPrefs: {
      driver: 'INFO',
      server: 'INFO',
      browser: 'ALL',
    }
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
          displayStacktrace: 'all',
        }
      })
    );

    /* Provide cookie consent */
    const EC = ExpectedConditions;
    const okConsent = element(by.xpath('//page-cookie-consent/ion-grid/ion-row[2]/ion-col/button'));

    const retries = {
      forever: true,
      factor: 1.2,
      minTimeout: 5000,
      maxTimeout: 10000,
      randomize: true,
    }

    return global.browser.getProcessedConfig()
      .then(() => waitForHttp('http://localhost:8100', 'frontend', retries))
      .then(() => browser.get('/'))
      .then(() => browser.waitForAngular())
      .then(() => browser.getTitle())
      .then((title) => {
        console.log(`title: ${title}`);
        rootTitle = title;
        console.log('waiting for Angular on /signup ...');
      })
      .then(() => browser.get('/signup'))
      .then(() => browser.waitForAngular())
      .then(() => browser.getTitle())
      .then((title) => {
        console.log(`title: ${title}`);
        console.log('checking for Angular on /cookie-consent ...');
      })
      .then(() => browser.get('/cookie-consent'))
      .then(() => browser.waitForAngular())
      .then(() => browser.getTitle())
      .then((title) => {
        console.log(`title: ${title}`);
        if (title == rootTitle) {
          console.log('... cookie consent not present.');
        } else {
          console.log('waiting to disable cookie consent ...');
          return browser.get('/signup')
            .then(() => browser.waitForAngular())
            .then(() => browser.sleep(30000))  // Ignore ESLintBear (protractor/no-browser-sleep)
            .then(() => browser.wait(
              EC.elementToBeClickable(okConsent),
              30000,
              'okConsent does not become clickable after 30 seconds'))
            .then(() => okConsent.click())
            .then(() => {
              console.log('... cookie consent disabled.');
            });
        }
      });
  }
};
