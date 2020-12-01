const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const validateNpmPackageName = require('validate-npm-package-name');
const inquirer = require('inquirer');
const { exec } = require('shelljs');

const { writeFiles } = require('../util');

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
        { name: 'React with Ant Design', value: 'react.antd' },
        { name: 'Vue with iView', value: 'vue.iview' },
      ],
    },
  ]);
  if (framework === 'vue.iview') {
    console.log('Vue with iView will come sonn, just waitting for it...');
    return;
  }
  //
  const { appName, targetDir } = this;
  console.log(`\nCreating project in ${chalk.yellow(targetDir)} ...\n`);

  // 写入package.json
  const { version, plugins } = defaults;
  const package = {
    name: appName,
    version,
    devDependencies: Object.assign({}, plugins),
  };
  await writeFiles(targetDir, {
    'package.json': JSON.stringify(package, null, 2),
  });

  // 安装cli插件依赖
  exec('yarn install', { cwd: targetDir });

  // 写入
  const p = `node_modules/wing-cli-service/generator/template/${framework}`;
  async function copyFiles() {
    try {
      await fs.copy(path.resolve(targetDir, p), targetDir);
    } catch (error) {
      console.error(error);
    }
  }
  await copyFiles();

  // // 初始化git仓库 确保.gitignore文件已经读写完成
  // exec('git init', { async: false, cwd: targetDir });
};
const defaults = {
  version: '0.1.0',
  plugins: {
    'wing-cli-service': '^0.0.1',
  },
};
module.exports = (...args) => {
  return createAction(...args).catch((error) => {
    if (error) {
      process.exit(1);
    }
  });
};
