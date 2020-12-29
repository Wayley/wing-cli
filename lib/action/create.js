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

  // Micro Frontend Main App's config
  // 写入微前端服务 主应用的配置文件
  if (framework === 'micro.fe.main') {
    const { appNum } = await inquirer.prompt([
      {
        type: 'input',
        message: 'Please enter the number of your micro-application:',
        name: 'appNum',
        validate(value) {
          if (value == '') {
            throw chalk.red(
              new Error('Please enter the number of the app you will register')
            );
          }
          if (isNaN(value * 1)) {
            throw chalk.red(
              new Error('The app number is expected to be Number')
            );
          }
          return true;
        },
        default: 3,
      },
    ]);
    const defaultCont = `export default {
  appName: '',
  apps: [
    // {
    //   name: 'subapp1', // 子应用标识
    //   entry: '//localhost:6001',
    //   path: '/subapp1', // 子应用路由匹配
    //   label: 'A系统', // 子应用名称(在主应用菜单显示的名称)
    // },
    ${new Array(appNum * 1)
      .fill(
        `{
      name: '',
      entry: '',
      path: '',
      label: '',
    }`
      )
      .join(',\n    ')},
  ],
};
`;
    const { content } = await inquirer.prompt([
      {
        type: 'editor',
        message: 'Please enter the editor content',
        name: 'content',
        default: defaultCont,
      },
    ]);
    await writeFiles(targetDir, {
      'config.js': content,
    });
  }

  console.log(`\nCreating project in ${chalk.yellow(targetDir)} ...\n`);

  const defaults = {
    version: '0.0.1',
    plugins: {
      'wing-cli-service': '^0.0.1',
    },
  };

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
  // FIXME: exec('yarn install', { cwd: targetDir });

  // 写入template
  // FIXME: const template = `node_modules/wing-cli-service/generator/template/${framework}`;
  const template = `../../../wing-cli-service/generator/template/${framework}`;
  async function copyFiles() {
    try {
      await fs.copy(path.resolve(targetDir, template), targetDir);
    } catch (error) {
      console.error(error);
    }
  }
  await copyFiles();

  // 重新写入package.json
  let pkg = await fs.readJson(`${targetDir}/package.json`);
  await writeFiles(targetDir, {
    'package.json': JSON.stringify(
      Object.assign(pkg, {
        name: appName,
        version,
        copyright: `wing@-${appName}`,
        private: true,
      }),
      null,
      2
    ),
  });

  // 安装项目依赖
  console.log('\nInstalling dependencies, this might take a while...');
  FIXME: exec('yarn install', { cwd: targetDir });

  // 初始化git仓库 要先确保.gitignore文件已经读写完成
  console.log('\n');
  exec('git init', { cwd: targetDir });
  exec('git add -A', { cwd: targetDir });
  exec('git commit -m init', { cwd: targetDir });

  //
  console.log(`\nSuccessfully created project ${chalk.yellow(appName)}`);
  console.log(`Now you can get started with the following commands:\n`);
  console.log(`${chalk.blue(`$ cd ${appName}`)}\n`);
  console.log(`${chalk.blue(`$ npm run start`)}\n`);
};
module.exports = (...args) => {
  return createAction(...args).catch((error) => {
    if (error) {
      process.exit(1);
    }
  });
};
