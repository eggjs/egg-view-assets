'use strict';

exports.getStyle = function getStyle(a) {
  const { entryCss, assetsUrl } = this.ctx.locals;
  return `<link rel="stylesheet" href="${assetsUrl}/${a || entryCss}"></script>`;
};
exports.getScript = function(a) {
  const { entry, assetsUrl } = this.ctx.locals;
  return `<script src="${assetsUrl}/${a || entry}"></script>`;
};

exports.getAssetsContext = function() {
  return this.ctx.locals.context;
};
