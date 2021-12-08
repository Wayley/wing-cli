const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ShebangPlugin = require('webpack-shebang-plugin');
const { name, version, license, author } = require('./package.json');
const banner = [
  `/*!`,
  ` * ${name} v${version}`,
  ` * Copyright © 2017-${new Date().getFullYear()} ${author.name || author}`,
  ` * Released under the ${license} License`,
  ` *`,
  ` */`,
].join(`\n`);
module.exports = (env, argv) => {
  const { EXCLUDE_EXTERNALS } = env;
  let config = {
    mode: 'production', // development production
    target: 'node',
    entry: {
      wing: './src/bin/index.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    plugins: [
      new ShebangPlugin(),
      new webpack.BannerPlugin({ banner, raw: true, entryOnly: true }),
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: { format: {} },
          extractComments: false,
        }),
      ],
    },
  };
  if (EXCLUDE_EXTERNALS) {
    const { dependencies } = require('./package.json');
    if (dependencies) {
      let externals = {};
      for (const key in dependencies) {
        if (Object.hasOwnProperty.call(dependencies, key)) {
          externals[key] = `commonjs2 ${key}`;
        }
      }
      config['externals'] = externals;
    }
  }
  return config;
};
