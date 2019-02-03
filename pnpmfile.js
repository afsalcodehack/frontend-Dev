'use strict'
module.exports = {
  hooks: {
    readPackage,
  },
}

// All of these should be fixed upstream.
// https://gitlab.com/viperdev/template/ionic/issues/77

function readPackage(pkg) {
  if (!pkg.dependencies) return pkg;

  // As it is private, this is the app pkg
  // https://gitlab.com/viperdev/template/ionic/issues/111
  if (pkg.private) {
    Object.assign(pkg.dependencies, {
      setimmediate: '1.0.5',
      // These are needed for mtw, and could be ngx-masonry or ngx-quill.
      // However they are also part of the dependencies of template
      // repo, so it does not hurt to have them added globally.
      'base64-js': '*',
      ieee754: '*',
    });
  } else if (pkg.optionalDependencies) {
    pkg.optionalDependencies = {};
  }

  // transpile fails due to:
  // Cannot find type definition file for 'localforage'
  if (pkg.dependencies['@ionic/storage']) {
    Object.assign(pkg.dependencies, {
      localforage: '1.7.2',
      'localforage-cordovasqlitedriver': '1.7.0',
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

  if (pkg.dependencies['buffer']) {
    Object.assign(pkg.dependencies, {
      'base64-js': '*',
      'ieee754': '*',
    });
  }

  if (pkg.dependencies['ngx-masonry']) {
    Object.assign(pkg.dependencies, {
      'masonry-layout': '*',
      'imagesloaded': '*',
    });
  }

  if (pkg.dependencies['masonry-layout']) {
    Object.assign(pkg.dependencies, {
      'get-size': '*',
      'outlayer': '*',
    });
  }

  if (pkg.dependencies['imagesloaded']) {
    Object.assign(pkg.dependencies, {
      'ev-emitter': '*',
    });
  }

  if (pkg.dependencies['outlayer']) {
    Object.assign(pkg.dependencies, {
      'fizzy-ui-utils': '*',
    });
  }

  if (pkg.dependencies['fizzy-ui-utils']) {
    Object.assign(pkg.dependencies, {
      'desandro-matches-selector': '*',
    });
  }

  if (pkg.dependencies['ngx-quill']) {
    Object.assign(pkg.dependencies, {
      'quill': '*',
    });
  }

  if (pkg.name === '@agm/snazzy-info-window') {
    Object.assign(pkg.dependencies, {
      '@agm/core': '*',
    });
  }

  return pkg;
}
