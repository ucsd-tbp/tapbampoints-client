var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/static/index.html',
  inject: 'body',
});

var DotenvWebpackPlugin = require('dotenv-webpack');
var DotenvWebpackPluginConfig = new DotenvWebpackPlugin();

var ReactMinificationPlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  }
});

// TODO Add tree-shaking to avoid bundling unused dependencies.
module.exports = {
  entry: ['babel-polyfill', './client/index.jsx'],

  resolve: {
    // Lets JSX files be imported without adding the .jsx suffix.
    extensions: ['', '.js', '.jsx'],
  },

  output: {
    path: __dirname + '/build',
    filename: '/bundle.js',
  },

  module: {
    loaders: [
      // Parses both JS and JSX files but ignores node_modules/.
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
    ],
  },

  plugins: [HtmlWebpackPluginConfig, DotenvWebpackPluginConfig, ReactMinificationPlugin],

  devServer: {
    historyApiFallback: true,
  },
};
