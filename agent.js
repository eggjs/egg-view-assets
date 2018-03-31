'use strict';

const assert = require('assert');
const DevServer = require('./lib/dev_server');

module.exports = agent => {
  if (!agent.config.assets.isLocal) return;
  if (!agent.config.assets.devServer.enable) return;

  assert(agent.config.assets.devServer.port, 'devServer.port is required when devServer is enabled');

  const server = new DevServer(agent);
  server.ready(err => {
    if (err) agent.coreLogger.error('[egg-view-assets]', err.message);
  });

  if (agent.config.assets.devServer.waitStart) {
    agent.beforeStart(async () => {
      await server.ready();
    });
  }

  agent.beforeClose(async () => {
    await server.close();
  });
};
