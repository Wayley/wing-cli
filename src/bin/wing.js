#!/usr/bin/env node

'use strict';

// Check node version before requiring/doing anything else
// The user may be on a very old node version

const satisfies = require('semver').satisfies;
const chalk = require('chalk');
const packageName = require('../../package.json').name;
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
checkNodeVersion(require('../../package.json').engines.node, packageName);

const EOL_NODE_MAJORS = ['8.x', '9.x', '11.x', '13.x'];
for (const major of EOL_NODE_MAJORS) {
  if (satisfies(process.version, major)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}.\n` +
          `Node.js ${major} has already reached end-of-life and will not be supported in future major releases.\n` +
          `It's strongly recommended to use an active LTS version instead.`
      )
    );
  }
}

const program = require('commander');
const leven = require('leven');
function getCliName() {
  const path = require('path');
  let _NAME_;
  if (process.argv && process.argv[1]) {
    _NAME_ = path.basename(process.argv[1], path.extname(process.argv[1]));
  }
  return _NAME_;
}
const _CLI_NAME_ = getCliName() || packageName;

program
  .version(`${require('../../package.json').version}`)
  .usage('<command> [options]');

program
  .command('create <app-name>')
  .description(`create a new project powered by ${_CLI_NAME_} service`)
  .option('-p, --port [port]', 'locale running port', 3000)
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    console.log('Create', name, options);
  });
const SUPPORT_UI_THEMES = [
  { label: 'OTA Style', value: 'ota' },
  { label: 'PSS Style', value: 'pss' },
  { label: 'Dashboard Style', value: 'dashboard' },
];
const SUPPORT_FRAMEWORKS = [
  { label: 'Vue2.x', value: 'vue2' },
  { label: 'Vue3.x', value: 'vue3' },
  { label: 'React16.x', value: 'react16' },
];
function renderDisplay(list) {
  return list.map((o) => '`' + o['label'] + '(' + o['value'] + ')`').join(', ');
}
program
  .command('init <app-name>')
  .description(`quickly init a new project powered by ${_CLI_NAME_} service`)
  .option(
    '-f, --framework [framework]',
    `javascript framework, incluing ${renderDisplay(SUPPORT_FRAMEWORKS)}`,
    'vue2'
  )
  .option(
    '-u, --ui-theme [uiTheme]',
    `we provide some ui themes, incluing ${renderDisplay(SUPPORT_UI_THEMES)}`,
    'ota'
  )
  .option('-p, --port [port]', 'locale running port', 3000)
  .action((name, cmd) => {
    const options = cleanArgs(cmd);
    console.log('init', name, options);
  });

// output help information on unknown commands
program.arguments('[command]').action((cmd) => {
  program.outputHelp();
  if (cmd) {
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
    console.log();
    suggestCommands(cmd);
  }
});

// add some useful info on help
program.on('--help', () => {
  console.log();
  console.log(
    `  Run ${chalk.cyan(
      `${_CLI_NAME_} <command> --help`
    )} for detailed usage of given command.`
  );
  console.log();
});

program.commands.forEach((c) => c.on('--help', () => console.log()));

program.parse(process.argv);

function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map((cmd) => cmd._name);

  let suggestion;

  availableCommands.forEach((cmd) => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ''));
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}
