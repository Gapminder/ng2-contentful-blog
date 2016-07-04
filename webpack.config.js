'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const contentfulConfig = JSON.parse(
  fs.readFileSync('demo/contentful.json') //eslint-disable-line no-sync
);

const dest = 'build';
const absDest = root(dest);

const config = {

  devtool: 'sourcemap',
  context: __dirname,  displayErrorDetails: true,
  stats: {
    colors: true,
    reasons: true
  },


  resolve: {
    cache: false,
    root: __dirname,
    extensions: ['', '.ts', '.js', '.json', '.styl', '.css', 'html']
  },

  entry: {
    vendor: [
      'es6-shim',
      'es6-promise',
      'zone.js',
      'es7-reflect-metadata',
      '@angular/common',
      '@angular/core',
      '@angular/http',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'lodash'
    ],
    'angular2-gapminder-demo': ['./demo/app.ts']
    // 'app': ['./demo/app.ts']
  },

  output: {
    path: absDest,
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },
  module: {
    loaders: [
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      },
      { test: /\.json$/, loader: 'json' },
      {
        test: /\.ts$/,
        loader: 'ts'
      },
      // {
      //   test: /\.css$/,
      //   loader: 'style!css!stylus?resolve url'
      // },
      {
        test: /\.(styl|css)$/,
        loader: 'to-string!css!stylus?resolve url'
      },
      {
        test: /\.html$/,
        loader: 'raw'
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'ng2-gapminder',
      template: 'demo/index.ejs',
      inject: 'body'
    }),
    new CleanWebpackPlugin(['build'], {
      root: __dirname,
      verbose: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new webpack.DefinePlugin({
      CONTENTFUL_ACCESS_TOKEN: JSON.stringify(contentfulConfig.accessToken),
      CONTENTFUL_SPACE_ID: JSON.stringify(contentfulConfig.spaceId),
      CONTENTFUL_HOST: JSON.stringify(contentfulConfig.host)
    })
  ],
  devServer: {
    inline: true,
    colors: true,
    historyApiFallback: true,
    contentBase: dest,
    //publicPath: dest,
    outputPath: dest,
    watchOptions: {aggregateTimeout: 300, poll: 1000},
    host: 'localhost',
    port: 8080
  }
};

module.exports = config;

function root(partialPath) {
  return path.join(__dirname, partialPath);
}
