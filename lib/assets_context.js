'use strict';

const getAssetsUrl = Symbol('AssetsContext#getAssetsUrl');

class Assets {
  constructor(ctx, options = {}) {
    this.ctx = ctx;
    if (options.entry) {
      this.entry = options.entry;
      this.entryCss = options.entry.replace(/\.jsx?$/, '.css');
    }
    this.locals = options.locals;
    this.root = options.root;
    this.env = ctx.app.config.env;
    this.config = ctx.app.config.assets;
    this.url = this[getAssetsUrl]();
  }

  getStyle(entry) {
    return linkTpl({ url: `${this.url}/${entry || this.entryCss}` });
  }

  getScript(entry) {
    console.log(222, this.config);
    const { common } = this.config.template.common;

    let script = '';
    if (common) script += scriptTpl({ url: `${this.url}/common.js` });
    script += scriptTpl({ url: `${this.url}/${entry || this.entry}` });
    return script;
  }

  getContext() {
    return `<script>window.context = ${JSON.stringify(this.locals)}</script>`;
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
