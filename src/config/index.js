const { engines, name, version, copyright } = require('@@/package.json');

// Configs of CLI
module.exports = {
  engines, // CLI Expected Node Engines
  name, // CLI Name
  version, // CLI Version
  copyright: `Copyright © ${copyright} 20172-${new Date().getFullYear()}`, // CLI Copyright
};
