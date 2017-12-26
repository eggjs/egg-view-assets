'use strict';

const DevServer = require('./lib/dev_server');


module.exports = agent => {
  const server = new DevServer(agent);
  server.ready(err => {
    if (err) agent.coreLogger.error(err);
  });

  agent.beforeClose(function* () {
    yield server.close();
  });
};
