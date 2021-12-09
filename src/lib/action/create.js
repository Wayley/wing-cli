const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const validateNpmPackageName = require('validate-npm-package-name');
const inquirer = require('inquirer');
const { exec } = require('shelljs');

const Creator = require('../Creator');

/**
 * @description
 * @param {*} { name, overwrite }
 * @returns
 */
async function doAction({ name, overwrite }) {
  try {
    const targetDir = path.resolve(process.cwd(), name);

    // 检查包名是否合法
    const result = validateNpmPackageName(name);
    if (!result.validForNewPackages) {
      console.error(chalk.red(`Invalid package name: "${name}"`));
      result.errors &&
        result.errors.forEach((error) => {
          console.error(chalk.red.dim('Error: ' + error));
        });
      result.warnings &&
        result.warnings.forEach((warning) => {
          console.error(chalk.red.dim('Warning: ' + warning));
        });
      process.exit(1);
    }
    // 检测是否存在同名文件夹
    if (fs.existsSync(targetDir)) {
      console.warn(
        `Target directory ${chalk.cyan(targetDir)} already existed.`
      );
      if (overwrite) {
        console.log(`\nRemoving ${chalk.cyan(targetDir)} ...`);
        fs.removeSync(targetDir);
      } else {
        return;
      }
    }

    // Action Instance
    const creator = new Creator({ name, targetDir });
    await creator.create();
  } catch (error) {
    throw error;
  }
}

module.exports = (...args) => {
  return doAction(...args).catch((error) => {
    if (error) {
      console.error(chalk.red(error));
      process.exit(1);
    }
  });
};
