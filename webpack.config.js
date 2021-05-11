const path = require('path');

module.exports = {
  mode: 'production', // development production
  target: 'node',
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
      {
        test: /\.js$/,
        loader: 'node-loader',
      },
    ],
  },
  entry: '/bin/wing.js',
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
