'use strict';

const assert = require('assert');

class Assets {
  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.app.config.assets;
    this.isLocal = this.config.isLocal;
    this.manifest = this.config.manifest;
  }

  get host() {
    return this.config.url;
  }

  get resourceBase() {
    if (this.isLocal) return this.host + '/';
    return `${this.host}${this.config.publicPath}/`;
  }

  getStyle(entry) {
    entry = entry || this.entryCss;
    return linkTpl({ url: this.getURL(entry) });
  }

  getScript(entry) {
    entry = entry || this.entry;

    let script = '';
    if (this.config.publicPath) {
      script = `<script>window.__webpack__public_path__ = '${this.config.publicPath}';</script>`;
    }
    script += scriptTpl({ url: this.getURL(entry) });
    return script;
  }

  getContext(data) {
    data = data || this.assetsContext || {};
    return `<script>window.${this.config.contextKey} = ${JSON.stringify(data)};</script>`;
  }

  setEntry(entry) {
    if (!entry) return;
    this.entry = entry;
    this.entryCss = entry.replace(/\.jsx?$/, '.css');
  }

  setContext(context) {
    this.assetsContext = context;
  }

  getURL(entry) {
    if (this.isLocal) {
      return `${this.host}/${entry}`;
    }

    const urlpath = this.manifest[entry];
    assert(urlpath, `Don't find ${entry} in manifest.json`);
    return `${this.resourceBase}${urlpath}`;
  }

}

module.exports = Assets;

function linkTpl({ url }) {
  return `<link rel="stylesheet" href="${url}"></link>`;
}

function scriptTpl({ url }) {
  return `<script src="${url}"></script>`;
}
