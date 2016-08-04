'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const contentfulConfig = JSON.parse(
  fs.readFileSync('demo/contentful.json') //eslint-disable-line no-sync
);

var commonConfig = {
  devtool: 'source-map',
  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.styl', '.css', 'html']
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
        loaders: ['ts-loader', 'angular2-template-loader']
      },
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
    new webpack.optimize.OccurenceOrderPlugin(true),
    new HtmlWebpackPlugin({
      title: 'ng2-contentful-blog',
      template: 'demo/index.ejs',
      inject: false
    }),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true
    }),
    new webpack.DefinePlugin({
      CONTENTFUL_ACCESS_TOKEN: JSON.stringify(contentfulConfig.accessToken),
      CONTENTFUL_SPACE_ID: JSON.stringify(contentfulConfig.spaceId),
      CONTENTFUL_HOST: JSON.stringify(contentfulConfig.host)
    })
  ]
};

var clientConfig = {
  target: 'web',
  entry: './demo/client',
  output: {
    path: root('dist/client')
  },
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};


var serverConfig = {
  target: 'node',
  entry: './demo/server', // use the entry file of the node server if everything is ts rather than es5
  output: {
    path: root('dist/server'),
    libraryTarget: 'commonjs2'
  },
  externals: checkNodeImport,
  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};

// Default config
var defaultConfig = {
  context: __dirname,
  resolve: {
    root: root('/demo')
  },
  output: {
    publicPath: '/',
    // publicPath: path.resolve(__dirname),
    filename: 'index.js'
  },
  devServer: {
    historyApiFallback: true,
    host: 'localhost',
    port: 8080
  }
};

var webpackMerge = require('webpack-merge');
module.exports = [
  // Server
  webpackMerge({}, defaultConfig, commonConfig, serverConfig),

  // Client
  webpackMerge({}, defaultConfig, commonConfig, clientConfig),
];

// Helpers
function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
