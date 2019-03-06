# Picllary

An Ionic 3 Cookiecutter project.

## Dependencies

Node 8 is used by all projects based on the template.

Use a version switcher like [asdf](https://github.com/asdf-vm/asdf) to install
the latest version of node 8 without interferring with the system node.

This project uses [pnpm](https://pnpm.js.org/) as a replacement for npm.

```
npm install -g pnpm
pnpm --version
```

There are a few hacks in `pnpmfile.js` to workaround bugs in upstream
package metadata.

The other global dependencies should match the versions in the build image at
https://github.com/marcoturi/ionic-docker/blob/master/Dockerfile

```
pnpm install -g cordova@8.0.0
pnpm install -g ionic@3.20.0
pnpm install -g typescript@2.6.2
```


## Running the App

```
git clone git@gitlab.com:viperdev/template/ionic.git
cd ionic
pnpm  i
./.ci/bin/change-environment backendless
ionic serve -l
```

## Backend Connect

The backend URL is in `src/config/environment.ts`.

Note: Currently the backend of this template is set to work with
[our backend template](https://gitlab.com/viperdev/template/django-backend).

A script `.ci/bin/change-environment` should be used to change the backend
URL to one of the following named environments:

- backendless:
  - No API/backend - use the fakeBackend provider as the backend
  - URL: None
- dev:
  - Points to the development environment using the prod mode
  - URL: https://django-backend.template.viperdev.io/
- ionic-serve-dev:
  - Points to the development environment using the debug mode
  - URL: https://django-backend.template.viperdev.io/
- local:
  - Points to API assuming django-template is running on local machine
  - URL: http://localhost:8000/

## Fake Backend

When environment offline mode is enabled, fake backend is preferred.
See more on [Fake Backend Doc](src/app/backends/README.md)

To activate the fake backend

```
.ci/bin/change-environment backendless
```

## Running end-to-end tests

The end-to-end tests in this repository work with the fake backend only,
so be sure to `change-environment` to the fake backend first.

Run `ionic serve` and load http://localhost:8100/debug
to check it reports environment 'backendless'.

While the application is being served, run
`pnpm run e2e` to execute the end-to-end tests via
[Protractor](http://www.protractortest.org/).

If there are failures, screenshots and logs can be viewed by opening
`./e2e_report/index.html` in a web browser.

The tests are located in directory `tests/e2e`.

## Translations

### Extracting Strings

```
npm run extract
```

### Translating with moban

See [translation.md](https://gitlab.com/viperdev/template/ionic/blob/master/translation.md)
for more information on translating with moban.

### Translating

It's as simple as opening `src/assets/i18n/de.json` with any text editor and
getting started on that :)

## File Formatting

Please install the relevant plugin if your editor of choice does not
natively support [EditorConfig](https://editorconfig.org/)

Before submitting a merge request, run `coala` which checks based on rules
in `.coafile`.  Those rules are enforced by CI.

If the coala output says a linter is missing, please install it.

The list of linters used by CI can be found in the "viperdev/coala-ngx" Dockerfile.

A docker with all linters can be run using:

```sh
$ docker run -v=$(pwd):/app --workdir=/app viperdev/coala-ngx coala --ci --verbose
```

## Deploying to netlify for dev-testing

Install [netlifyctl](https://github.com/netlify/netlifyctl) in your development
machine and ensure the binary `netlifyctl` is in your PATH.

Run `netlifyctl login` and login with the account that has access to the
dev-netlify-sideId of the project. Or get the API-KEY for the
dev-netlify-siteId.

Build a prod version of the project with
`pnpm run build --prod`.

Deploy the build with `.ci/bin/deploy_netlify`. If using an api-key, run this
command as `NETLIFY_ACCESS_TOKEN=APIKEY .ci/bin/deploy_netlify`.
