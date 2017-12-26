'use strict';

const AssetsView = require('./lib/assets_view');

module.exports = app => {
  app.view.use('assets', AssetsView);
};
