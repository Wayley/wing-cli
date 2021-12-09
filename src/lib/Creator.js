const { writeFiles } = require('../util');

function Creator(options) {
  for (const key in options) {
    if (Object.hasOwnProperty.call(options, key)) {
      this[key] = options[key];
    }
  }
}
Creator.prototype.create = async function () {
  const { name, targetDir } = this;
  const dateTime = new Date().getTime();
  const package = { name, version: '0.0.1x', dateTime };
  await writeFiles(targetDir, {
    'package.json': JSON.stringify(package, null, 2),
  });
  console.log('Creator.create', dateTime);
};
module.exports = Creator;
