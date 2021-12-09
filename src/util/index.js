const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const validateNpmPackageName = require('validate-npm-package-name');

/**
 * @description 异步写入多文件
 * @param {String} targetDir 目标目录名称
 * @param {Object} files 文件信息
 */
exports.writeFiles = async function (targetDir, files) {
  Object.keys(files).forEach((fileName) => {
    try {
      const filePath = path.join(targetDir, fileName);
      fs.ensureDirSync(path.dirname(filePath));
      await fs.writeFile(filePath, files[fileName]);
    } catch (error) {
      throw error;
    }
  });
};

/**
 * @description 检查包名是否合法
 * @param {String} name
 */
exports.checkPackageName = function (name) {
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
};

/**
 * @description 检测是否存在同名文件夹,如果存在并标识overwrite,则进行移除
 * @param {String} targetDir
 * @param {Boolean} overwrite
 * @returns {Boolean}
 */
exports.checkPathExists = async function (targetDir, overwrite) {
  try {
    const exists = fs.existsSync(targetDir);
    if (exists) {
      console.warn(`Target directory ${chalk.cyan(targetDir)} already exists.`);
      if (overwrite) {
        console.log(`\nRemoving ${chalk.cyan(targetDir)} ...`);
        await fs.remove(targetDir);
      }
    }
    return exists;
  } catch (error) {
    throw error;
  }
};
