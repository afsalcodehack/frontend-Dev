export module lang {
  export const availableLanguages = [{
    code: 'en',
    name: 'English'
  }, {
    code: 'de',
    name: 'German'
  }];

  export const defaultLanguage = 'en';

  export const sysOptions = {
    systemLanguage: defaultLanguage
  };
}
