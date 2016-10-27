'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const dest = 'dist';
const absDest = root(dest);

const commonConfig = {
  devtool: 'source-map',
  context: __dirname,
  displayErrorDetails: true,
  output: {
    path: absDest,
    filename: '[name].js'
  },
  resolve: {
    root: root('/demo'),
    extensions: ['', '.ts', '.js', '.json', '.styl', '.css', 'html']
  },
  entry: {
    vendor: [
      'es6-shim',
      'es6-promise',
      'zone.js',
      'reflect-metadata',
      '@angular/common',
      '@angular/router',
      '@angular/core',
      '@angular/http',
      '@angular/compiler',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      'lodash'
    ],
    'angular2-contentful-blog-demo': ['./demo/app.ts']
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
      {test: /\.json$/, loader: 'json'},
      {
        test: /\.html$/,
        // test: /\.(html|css)$/,
        loader: 'raw-loader'
      },
      {
        test: /\.ts$/,
        loaders: ['ts-loader', 'angular2-template-loader']
      },
      {
        test: /\.(styl|css)$/,
        loader: 'to-string!css!stylus?resolve url'
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    port: 8080
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
    new HtmlWebpackPlugin({
      title: 'ng2-contentful-blog',
      template: 'demo/index.ejs',
      inject: 'body'
    }),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true
    })
  ]
};

// Helpers
function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request);
    return;
  }
  cb();
}

module.exports = commonConfig;

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
