const { engines, name, version, copyright } = require('../package.json');

// Configs of CLI
module.exports = {
  engines, // CLI Expected Node Engines
  name, // CLI Name
  version, // CLI Version
  copyright: `Copyright © ${copyright} 2017-${new Date().getFullYear()}`, // CLI Copyright
};
