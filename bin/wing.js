#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version
'use strict';
const { satisfies } = require('semver');
const chalk = require('chalk');
const { engines, name, version } = require('../config');

function checkNodeVersion(expectedVersion, pakName) {
  if (!satisfies(process.version, expectedVersion)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${pakName} requires Node ${expectedVersion}'.\n\nPlease upgrade your Node version.`
      )
    );
    process.exit(1);
  }
}
checkNodeVersion(engines.node, name);

// Add Commands
const program = require('commander');
const createAction = require('../lib/action/create');

program.version(version).usage('<command> [options]');

// Create Command
program.command('create <app-name>').action((appName) => {
  createAction(appName);
});

// init Command
program.command('init <app-name>').action((appName) => {
  console.log(
    chalk.blue('init '),
    chalk.yellow(`command in ${appName} is in development..., and you can try`),
    chalk.green(' create '),
    chalk.yellow('command')
  );
});
// plugin Command
program.command('plugin <plugin-name>').action((pluginName) => {
  console.log(
    chalk.blue('plugin '),
    chalk.yellow(`command in ${appName} is in development..., and you can try`),
    chalk.green(' create '),
    chalk.yellow('command')
  );
});
program.parse(process.argv);
