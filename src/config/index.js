const name = require('../../package.json').name;
const version = require('../../package.json').version;
const copyright = require('../../package.json').copyright;
const engines = require('../../package.json').engines;
module.exports = {
  name,
  version,
  engines,
  copyright: `Copyright © ${copyright} 2017-${new Date().getFullYear()}`, // CLI Copyright
};
