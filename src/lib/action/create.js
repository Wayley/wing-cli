const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const validateNpmPackageName = require('validate-npm-package-name');
const inquirer = require('inquirer');
const { exec } = require('shelljs');

const { writeFiles } = require('@lib/util');

async function createAction(appName) {
  const result = validateNpmPackageName(appName);
  const targetDir = path.resolve(process.cwd(), appName);

  // 检查appName是否合法
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid app name: "${appName}"`));
    result.errors &&
      result.errors.forEach((error) => {
        console.error(chalk.red.dim('Error: ' + error));
      });
    result.warnings &&
      result.warnings.forEach((warning) => {
        console.error(chalk.red.dim('Warning: ' + warning));
      });
    exit(1);
  }
  // 检测是否存在同名文件夹
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: `Target directory ${chalk.cyan(
          targetDir
        )} already exists. Pick an action:`,
        choices: [
          { name: 'Overwrite', value: 'overwrite' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);
    if (action === 'overwrite') {
      console.log(`\nRemoving ${chalk.cyan(targetDir)} ...`);
      await fs.remove(targetDir);
    } else {
      return;
    }
  }
  const creator = new Creator(appName, targetDir);
  await creator.create();
}
function Creator(appName, targetDir) {
  this.appName = appName;
  this.targetDir = targetDir;
}
Creator.prototype.create = async function () {
  // framework pick
  const { framework } = await inquirer.prompt([
    {
      name: 'framework',
      type: 'list',
      message: 'Pick a framework which you want: ',
      choices: [
        // Micro frontend templates
        { name: 'Micro frontend Pure html', value: 'micro.fe.purehtml' },
        {
          name: 'Micro frontend App with React(Ant Design)',
          value: 'micro.fe.react.antd',
        },
        {
          name: 'Micro frontend App with Vue(iView)',
          value: 'micro.fe.vue.iview',
        },
        { name: 'Micro frontend Main App', value: 'micro.fe.main' },
        //Normal  frontend templates
        { name: 'React with Ant Design', value: 'react.antd' },
        { name: 'Vue with iView', value: 'vue.iview' },
      ],
    },
  ]);

  //
  const { appName, targetDir } = this;
  const pkg = {
    name: appName,
    framework,
  };
  console.log(pkg);
  await writeFiles(targetDir, {
    'package.json': JSON.stringify(pkg, null, 2),
  });
  console.log('Success!');
};
module.exports = (...args) => {
  return createAction(...args).catch((error) => {
    if (error) {
      process.exit(1);
    }
  });
};
