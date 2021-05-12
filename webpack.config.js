const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const ShebangPlugin = require('webpack-shebang-plugin');
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
      alias: {
        '@@': path.resolve(__dirname, ''),
        '@config': path.resolve(__dirname, 'src/config'),
        '@lib': path.resolve(__dirname, 'src/lib'),
      },
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
  if (EXCLUDE_EXTERNALS) {
    config['externals'] = {
      chalk: 'commonjs2 chalk',
      commander: 'commonjs2 commander',
      'fs-extra': 'commonjs2 fs-extra',
      inquirer: 'commonjs2 inquirer',
      semver: 'commonjs2 semver',
      shelljs: 'commonjs2 shelljs',
      'validate-npm-package-name': 'commonjs2 validate-npm-package-name',
    };
  }
  return config;
};
