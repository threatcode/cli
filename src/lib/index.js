const threatcodeConfig = require('./config');

// This module is kind of "world object" that is used to indirectly import modules.
// This also introduces some circular imports.

// TODO(kyegupov): untangle this, resolve circular imports, convert to Typescript

const threatcode = {};
module.exports = threatcode;

threatcode.id = threatcodeConfig.id;

const apiToken = require('./api-token');

// make threatcode.api *always* get the latest api token from the config store
Object.defineProperty(threatcode, 'api', {
  enumerable: true,
  configurable: true,
  get: function() {
    return apiToken.api();
  },
  set: function(value) {
    threatcodeConfig.api = value;
  },
});

threatcode.test = require('./threatcode-test');
threatcode.policy = require('threatcode-policy');

// this is the user config, and not the internal config
threatcode.config = require('./user-config').config;
