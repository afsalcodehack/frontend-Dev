'use strict'
module.exports = {
  hooks: {
    readPackage,
  },
}

function readPackage(pkg) {
  if (!pkg.dependencies) return pkg;

  // As it is private, this is the app pkg
  // https://gitlab.com/viperdev/template/ionic/issues/111
  if (pkg.private) {
    Object.assign(pkg.dependencies, {
      setimmediate: '1.0.5',
    });
  }

  // transpile fails due to:
  // Cannot find type definition file for 'localforage'
  if (pkg.dependencies['@ionic/storage']) {
    Object.assign(pkg.dependencies, {
      localforage: '1.7.2',
      'localforage-cordovasqlitedriver': '1.6.0',
    });
  }

  // transpile fails due to missing package
  if (pkg.dependencies['@angular/common']) {
    Object.assign(pkg.dependencies, {
      tslib: '1.9.3',
    });
  }

  // npm run-script build --prod fails during webpack due to missing package
  if (pkg.dependencies['@ionic/app-scripts']) {
    Object.assign(pkg.dependencies, {
      '@angular-devkit/build-optimizer': '0.0.35',
    });
  }

  return pkg;
}
