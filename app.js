'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
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
    // if not set url,it will be `127.0.0.1:${devServer.port}`
    if (!assetsConfig.url) {
      assetsConfig.url = 'http://127.0.0.1:' + port;
    } else {
      assetsConfig.url = assetsConfig.url + ':' + port;
    }
  }

  // it should check manifest.json on deployment
  if (!assetsConfig.isLocalOrUnittest) {
    const manifestPath = path.join(
      app.config.baseDir,
      'config/manifest.json'
    );
    assert(fs.existsSync(manifestPath), `${manifestPath} is required`);
    assetsConfig.manifest = require(manifestPath);
  }

  app.view.use('assets', AssetsView);
};
