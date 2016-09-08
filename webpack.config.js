var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: path.join(__dirname, 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'client'),
      exclude: /node_modules/
    }]
  }
};