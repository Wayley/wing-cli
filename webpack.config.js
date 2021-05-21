const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ShebangPlugin = require('webpack-shebang-plugin');
const {
  name,
  version,
  copyright,
  license,
  author,
  dependencies,
} = require('./package.json');
const AUTHOR = author.name || author;
const banner =
  '/*!\n' +
  ` * ${name} v${version}\n` +
  ` * Copyright © ${copyright} 2017-${new Date().getFullYear()} ${AUTHOR}\n` +
  ` * Released under the ${license} License.\n` +
  ' *\n' +
  ` */`;
module.exports = (env, argv) => {
  const { EXCLUDE_EXTERNALS } = env;
  let config = {
    mode: 'production', // development production
    entry: {
      wing: './src/bin/index.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    resolve: {
      alias: {},
    },
    plugins: [
      new ShebangPlugin(),
      new webpack.BannerPlugin({
        banner,
        raw: true,
        entryOnly: true,
      }),
    ],
    target: 'node',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {},
          },
          extractComments: false,
        }),
      ],
    },
  };
  if (EXCLUDE_EXTERNALS && dependencies) {
    let externals = {};
    for (const key in dependencies) {
      if (Object.hasOwnProperty.call(dependencies, key)) {
        externals[key] = `commonjs2 ${key}`;
      }
    }
    config['externals'] = externals;
  }
  return config;
};
