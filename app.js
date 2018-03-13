'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const AssetsView = require('./lib/assets_view');

module.exports = app => {
  const assetsConfig = app.config.assets;
  if (assetsConfig.isLocal && !assetsConfig.url) {
    assetsConfig.url = 'http://127.0.0.1:' + assetsConfig.devServer.port;
  }

  if (!assetsConfig.isLocal) {
    const manifestPath = path.join(app.config.baseDir, 'config/manifest.json');
    assert(fs.existsSync(manifestPath), `${manifestPath} is required`);
    assetsConfig.manifest = require(manifestPath);
  }

  app.view.use('assets', AssetsView);
};
