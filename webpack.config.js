var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/public/index.html',
  inject: 'body'
});

module.exports = {
  entry: './client/index.jsx',

  resolve: {
    // Lets JSX files be imported without adding the .jsx suffix.
    extensions: ['', '.js', '.jsx']
  },

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      // Parses both JS and JSX files but ignores node_modules/.
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },

  plugins: [HtmlWebpackPluginConfig]
};
