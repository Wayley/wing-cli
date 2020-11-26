const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const validateNpmPackageName = require('validate-npm-package-name');
const inquirer = require('inquirer');

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
    console.log('exist');
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
  console.log('appName: ', this.appName);
  console.log('targetDir: ', this.targetDir);
};
module.exports = (...args) => {
  return createAction(...args).catch((error) => {
    if (error) {
      process.exit(1);
    }
  });
};
