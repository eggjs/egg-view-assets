'use strict';

const getAssetsUrl = Symbol('AssetsContext#getAssetsUrl');

class Assets {
  constructor(ctx) {
    this.ctx = ctx;
    this.env = ctx.app.config.env;
    this.config = ctx.app.config.assets;
    this.url = this[getAssetsUrl]();
  }

  getStyle(entry) {
    entry = entry || this.entryCss;
    return linkTpl({ url: `${this.url}/${entry}` });
  }

  getScript(entry) {
    entry = entry || this.entry;
    const { common } = this.config.template.common;

    let script = '';
    if (common) script += scriptTpl({ url: `${this.url}/common.js` });
    script += scriptTpl({ url: `${this.url}/${entry}` });
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

  [getAssetsUrl]() {
    if (this.env !== 'local') return this.config.url;
    return `http://127.0.0.1:${this.config.devServer.port}`;
  }

}

module.exports = Assets;

function linkTpl({ url }) {
  return `<link rel="stylesheet" href="${url}"></link>`;
}

function scriptTpl({ url }) {
  return `<script src="${url}"></script>`;
}
