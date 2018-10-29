# Cookiecutter

An Ionic 3 Cookiecutter project.

## Dependencies

The other global dependencies should match the versions in the build image at
https://github.com/marcoturi/ionic-docker/blob/master/Dockerfile

```
npm install -g cordova@8.0.0
npm install -g ionic@3.20.0
npm install -g typescript@2.6.2
```


## Running the App

```
git clone https://github.com/viperdev/open/cookiecutters/ionic.git
cd ionic
npm i
ionic serve -l
```

## Backend Connect

Add backend url to `global.ts`

Note: Currently the backend of this template is set to work with:

```
https://gitlab.com/viperdev/open/cookiecutters/django-backend.git
```

## Fake Backend

When environment offline mode is enabled, fake backend is preferred.
See more on [Fake Backend Doc](src/app/backends/README.md)

## Translations

### Extracting Strings

```
npm run extract
```

### Translating with moban

See [translations.md](translation.md) for how to initialise translations
in a repository using moban.

### Translating

It's as simple as opening `src/assets/i18n/de.json` with any text editor and
getting started on that :)

If you'd like a better translation UI, you can download an editor at
https://www.codeandweb.com/babeledit/download.
