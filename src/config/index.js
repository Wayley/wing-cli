const name = require('../../package.json').name;
const version = require('../../package.json').version;
const copyright = require('../../package.json').copyright;
module.exports = {
  copyright: `${name} V${version} Copyright © ${copyright} 2017-${new Date().getFullYear()}`, // CLI Copyright
};
