'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const AssetsView = require('./lib/assets_view');

module.exports = app => {
  if (!app.config.assets.isLocal) {
    const manifestPath = path.join(app.config.baseDir, 'config/manifest.json');
    assert(fs.existsSync(manifestPath), `${manifestPath} is required`);
    app.config.assets.manifest = require(manifestPath);
  }

  app.view.use('assets', AssetsView);
};
