'use strict';

const DevServer = require('./lib/dev_server');


module.exports = agent => {
  const assetsConfig = agent.config.assets;

  const server = new DevServer(agent);
  server.ready(err => {
    if (err) agent.coreLogger.error(err);
  });
};
