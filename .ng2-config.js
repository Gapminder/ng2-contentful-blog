'use strict';
var pkg = require('./package.json');
const fs = require('fs');
const webpack = require('webpack');

const contentfulConfig = JSON.parse(
  fs.readFileSync('demo/contentful.json') //eslint-disable-line no-sync
);

module.exports = {
  // metadata
  title: pkg.description,
  baseUrl: '/',
  // root folder name
  src: 'demo',
  dist: 'demo-build',
  htmlIndexes: ['index.ejs'],
  // karma bundle src
  spec: './spec-bundle.js',
  // webpack entry
  entry: {
    polyfills: './demo/polyfills.ts',
    vendor: './demo/vendor.ts',
    main: './demo/app.ts'
  },
  commonChunks: {
    name: ['polyfills', 'vendor'].reverse()
  },
  // webpack alias
  alias: {},
  copy: [
    // {from: 'demo/favicon.ico', to: 'favicon.ico'}
  ],
  plugins: [
    new webpack.DefinePlugin({
      CONTENTFUL_ACCESS_TOKEN: JSON.stringify(contentfulConfig.accessToken),
      CONTENTFUL_SPACE_ID: JSON.stringify(contentfulConfig.spaceId),
      CONTENTFUL_HOST: JSON.stringify(contentfulConfig.host)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(styl|css)$/,
        loader: 'to-string!css!stylus?resolve url'
      }
    ]
  }
};
