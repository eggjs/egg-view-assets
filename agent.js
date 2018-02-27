'use strict';

const DevServer = require('./lib/dev_server');

module.exports = agent => {
  if (!agent.config.assets.isLocal) return;

  const server = new DevServer(agent);
  server.ready(err => {
    if (err) agent.coreLogger.error('[egg-view-assets]', err.message);
  });

  agent.beforeClose(async () => {
    await server.close();
  });

  process.once('SIGTERM', () => agent.close());
};
