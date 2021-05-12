#!/usr/bin/env node

'use strict';
// Check node version before requiring/doing anything else
// The user may be on a very old node version
const { satisfies } = require('semver');
const chalk = require('chalk');
const { engines, name, version } = require('@config');
const log = console.log;

function checkNodeVersion(expectedVersion, pakName) {
  if (!satisfies(process.version, expectedVersion)) {
    log(
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
const createAction = require('@lib/action/create');

program.version(version).usage('<command> [options]');

// Create Command
program.command('create <app-name>').action((appName) => {
  createAction(appName);
});

// init Command
program.command('init <app-name>').action((appName) => {
  log(' ');
  log(
    chalk.magenta(' init'),
    chalk.yellow(`command in ${appName} is in development..., and you can try`),
    chalk.green('create'),
    chalk.yellow('command')
  );
});
// plugin Command
program.command('plugin <plugin-name>').action((pluginName) => {
  log(
    chalk.magenta(' plugin'),
    chalk.yellow(
      `command in ${pluginName} is in development..., and you can try`
    ),
    chalk.green('create'),
    chalk.yellow('command')
  );
});
program.parse(process.argv);
