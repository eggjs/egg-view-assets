'use strict';

const AssetsContext = require('../../lib/assets_context');

const HELPER_ASSETS = require('../../lib/util/constant').HELPER_ASSETS;
const ASSETS = Symbol('Helper#assets');

module.exports = {
  get assets() {
    if (this[ASSETS]) return this[ASSETS];
    if (this.ctx[HELPER_ASSETS]) {
      this[ASSETS] = this.ctx[HELPER_ASSETS];
    } else {
      this[ASSETS] = new AssetsContext(this.ctx);
    }
    return this[ASSETS];
  },
};
