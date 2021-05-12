const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ShebangPlugin = require('webpack-shebang-plugin');
module.exports = {
  mode: 'production', // development production
  entry: {
    index: './bin/wing.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [new ShebangPlugin()],
  target: 'node',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
};
