# Ionic 2 Cookiecutter

### Dependencies

Globally install npm 5.8 to install dependencies.

https://npm.community/t/npm-install-no-optional-not-actually-filtering-optionals-in-cli-6-0-1-or-6-1-0/257

```
npm install -g npm@5.8.0
npm --version
```

The other global dependencies should match the versions in the build image at
https://github.com/marcoturi/ionic-docker/blob/master/Dockerfile

```
npm install -g cordova@8.0.0
npm install -g ionic@3.20.0
npm install -g typescript@2.6.2
```

GitLab CI uses a locked cache for node, which is typically only updated
on master builds.

Running cordova potentially changes package.json.

In the test phase, a job ensures that running cordova does not
create changes in package.json or package-lock.json which are not noticed.

It emits package-lock.json as an artifact.

If there are changes to package-lock.json, fetch the artifact and add it to
your branch.

This job log will also include a diff from the locked cached version of
package-lock.json.

### Running the App

```
git clone https://github.com/viperdev/open/cookiecutters/ionic.git
cd ionic
npm i
ionic serve -l
```

### Backend Connect

Add backend url to `global.ts`

Note: Currently the backend of this template is set to work with:

```
https://gitlab.com/viperdev/open/cookiecutters/django-backend.git
```

## Translations

### Extracting Strings

```
npm run extract
```

### Translating

It's as simple as opening `src/assets/i18n/de.json` with any text editor and
getting started on that :)

If you'd like a better translation UI, you can download an editor at
https://www.codeandweb.com/babeledit/download.
