'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const address = require('address');
const AssetsView = require('./lib/assets_view');

module.exports = app => {
  const assetsConfig = app.config.assets;

  if (assetsConfig.devServer.enable && assetsConfig.isLocalOrUnittest) {
    let port = assetsConfig.devServer.port;
    if (assetsConfig.devServer.autoPort === true) {
      try {
        port = fs.readFileSync(assetsConfig.devServer.portPath, 'utf8');
        assetsConfig.devServer.port = Number(port);
      } catch (err) {
        // istanbul ignore next
        throw new Error('check autoPort fail');
      }
    }
    const protocol = app.options.https && assetsConfig.dynamicLocalIP ? 'https' : 'http';
    const hostIP = assetsConfig.intranetIP ? address.ip() : '127.0.0.1';
    assetsConfig.url = `${protocol}://${hostIP}:${port}`;
  }

  // it should check manifest.json on deployment
  if (!assetsConfig.isLocalOrUnittest) {
    const manifestPath = path.join(app.config.baseDir, 'config/manifest.json');
    assert(fs.existsSync(manifestPath), `${manifestPath} is required`);
    assetsConfig.manifest = require(manifestPath);
  }

  app.view.use('assets', AssetsView);
};
