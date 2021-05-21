#!/usr/bin/env node

'use strict';

// Check node version before requiring/doing anything else
// The user may be on a very old node version
const { satisfies } = require('semver');
const chalk = require('chalk');
const { name, version, engines } = require('../config');
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

// Add Commands
const program = require('commander');
const {
  createAction,
  initAction,
  pluginAction,
} = require('../lib/action/index.js');
program.version(version).usage('<command> [options]');

// `create` Command
program.command('create <app-name>').action((appName) => {
  createAction(appName);
});

// `init` Command
program.command('init <app-name>').action((appName) => {
  initAction(appName);
});

// `plugin` Command
program.command('plugin <plugin-name>').action((pluginName) => {
  pluginAction(pluginName);
});

program.parse(process.argv);
