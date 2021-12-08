#!/usr/bin/env node

'use strict';

// Check node version before requiring/doing anything else
// The user may be on a very old node version
const { satisfies } = require('semver');
const chalk = require('chalk');
const name = require('../../package.json').name;
const engines = require('../../package.json').engines;
function checkNodeVersion(expectedVersion, packageName) {
  if (!satisfies(process.version, expectedVersion)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${packageName} requires Node ${expectedVersion}'.\n\nPlease upgrade your Node version.`
      )
    );
    process.exit(1);
  }
}
checkNodeVersion(engines.node, name);
// default configs
const { appName, framework } = { framework: 'react', appName: 'wing-app-demo' };

// Add Commands
const program = require('commander');
const version = require('../../package.json').version;

program.version(version).usage('<command> [options]');
program
  .option('-D, --debug', 'output extra debugging')
  .option('-p, --port <port>', 'locale running port', 3000)
  .option('-n, --app-name <appname>', 'application name', appName)
  .option(
    '-f, --framework <framework>',
    'application framework(Vue/React/PureHtml...)',
    framework
  )
  .option('--no-typescript', 'typescript using');

// `create cli` Command
program
  .command('create-cli <cli-name>')
  .description('create a cli tool')
  .action(() => {
    console.log('Command: create-cli', program.opts());
  });

// `create` Command
program
  .command('create [app-name]')
  .description('generate an application')
  .action((appName) => {
    console.log('Command: create', appName, program.opts());
  });

// `init` Command
program
  .command('init [app-name]')
  .description('generate an application with defaults')
  .action((appName) => {
    console.log('Command: init', appName);
  });

// `plugin` Command
program
  .command('plugin <plugin-name>')
  .description('generate a plugin')
  .action(() => {
    console.log('Command: plugin');
  });

program.parse(process.argv);
