'use strict';

const assert = require('assert');
const DevServer = require('./lib/dev_server');

module.exports = agent => startDevServer(agent);

function startDevServer(agent) {
  const assetsConfig = agent.config.assets;

  if (!assetsConfig.isLocalOrUnittest) return;
  if (!assetsConfig.devServer.enable) return;

  assert(assetsConfig.devServer.autoPort || assetsConfig.devServer.port, 'port or autoPort is required when devServer is enabled');

  const server = new DevServer(agent);
  server.ready(err => {
    if (err) agent.coreLogger.error('[egg-view-assets]', err.message);
  });

  if (assetsConfig.devServer.waitStart) {
    agent.beforeStart(async () => {
      await server.ready();
    });
  }

  agent.beforeClose(async () => {
    await server.close();
  });
}
