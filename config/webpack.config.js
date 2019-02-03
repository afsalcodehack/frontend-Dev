const webpackConfig = require('../node_modules/@ionic/app-scripts/config/webpack.config');
const webpack = require('webpack');

const environmentPlugin = new webpack.EnvironmentPlugin([
  'HEAD',
  'COMMIT_REF',
]);

webpackConfig.dev.plugins.push(environmentPlugin);
webpackConfig.prod.plugins.push(environmentPlugin);
