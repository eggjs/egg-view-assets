'use strict';

const assert = require('assert');
const getAssetsUrl = Symbol('AssetsContext#getAssetsUrl');

class Assets {
  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.app.config.assets;
    this.isLocal = this.config.isLocal;
    this.manifest = this.config.manifest;
  }

  getStyle(entry) {
    entry = entry || this.entryCss;
    return linkTpl({ url: this[getAssetsUrl](entry) });
  }

  getScript(entry) {
    entry = entry || this.entry;
    const { common } = this.config.template.common;

    let script = '';
    if (common) script += scriptTpl({ url: this[getAssetsUrl]('common.js') });
    script += scriptTpl({ url: this[getAssetsUrl](entry) });
    return script;
  }

  getContext(data) {
    data = data || this.assetsContext || {};
    return `<script>window.context = ${JSON.stringify(data)}</script>`;
  }

  setEntry(entry) {
    if (!entry) return;
    this.entry = entry;
    this.entryCss = entry.replace(/\.jsx?$/, '.css');
  }

  setContext(context) {
    this.assetsContext = context;
  }

  [getAssetsUrl](entry) {
    if (this.isLocal) {
      const host = `http://127.0.0.1:${this.config.devServer.port}`;
      return `${host}/${entry}`;
    }

    const host = this.config.url;
    const urlpath = this.manifest[entry];
    assert(urlpath, `Don't find ${entry} in manifest.json`);
    return `${host}${this.config.urlPrefix}/${urlpath}`;
  }

}

module.exports = Assets;

function linkTpl({ url }) {
  return `<link rel="stylesheet" href="${url}"></link>`;
}

function scriptTpl({ url }) {
  return `<script src="${url}"></script>`;
}
