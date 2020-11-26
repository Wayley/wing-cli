const fs = require('fs-extra');
const validateProjectName = require('validate-npm-package-name');
async function createAction(projectName) {
  console.log('projectName： ', projectName);
}
module.exports = (...args) => {
  return createAction(...args).catch((error) => {
    if (error) {
      process.exit(1);
    }
  });
};
