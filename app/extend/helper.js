'use strict';

// exports.getStyle = function getStyle(a) {
//   const { entryCss, assetsUrl } = this.ctx.locals;
//   return this.safe(`<link rel="stylesheet" href="${assetsUrl}/${a || entryCss}"></script>`);
// };
//
// exports.getScript = function(a) {
//   const { entry, assetsUrl } = this.ctx.locals;
//   const { common } = this.ctx.app.config.assets.template;
//
//   let script = '';
//   if (common) script += `<script src="${assetsUrl}/common.js"></script>`;
//   script += `<script src="${assetsUrl}/${a || entry}"></script>`;
//   return this.safe(script);
// };
//
// exports.getAssetsContext = function() {
//   return this.ctx.locals.context;
// };
//

const AssetsContext = require('../../lib/assets_context');

module.exports = {
  get assets() {
    return new AssetsContext(this.ctx);
  },
};
