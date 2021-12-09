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
  .option('-D, --debug', 'output extra debugging', false)
  .option('-p, --port <port>', 'locale running port', 3000)
  .option('-n, --app-name <app-name>', 'application or package name', appName)
  .option(
    '-f, --framework <framework>',
    'application framework(Vue/React/PureHtml...)',
    framework
  )
  .option('-desc, --desc [description]', 'application description', '') // `application` field causes a naming conflict, so use `desc` field.
  .option('--no-typescript', 'typescript using');

// `create cli` Command
program
  .command('create-cli <cli-name>')
  .description('create a cli tool')
  .action((name) => {
    const { desc } = program.opts();
    require('../lib/action/cli-create')({ name, desc });
  });

// `create` Command
program
  .command('create [app-name]')
  .description('generate an application')
  .action((name) => {
    const { version, appName, ...rest } = program.opts();
    require('../lib/action/create')({ name: name || appName, ...rest });
  });

// `init` Command
program
  .command('init [app-name]')
  .description('generate an application with defaults')
  .action((name) => {
    const { version, appName, ...rest } = program.opts();
    require('../lib/action/init')({ name: name || appName, ...rest });
  });

// `plugin` Command
program
  .command('plugin <plugin-name>')
  .description('generate a plugin')
  .action((name) => {
    const { desc } = program.opts();
    require('../lib/action/plugin')({ name, desc });
  });

program.parse(process.argv);
