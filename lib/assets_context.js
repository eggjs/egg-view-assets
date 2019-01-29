'use strict';

const assert = require('assert');

// URL consists of host, resourceBase and entry,
// E.X. http://127.0.0.1:7001/public/index.js
//    host is http://127.0.0.1:7001
//    resourceBase is /public/
//    entry is index.js
class Assets {

  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.app.config.assets;
    this.isLocalOrUnittest = this.config.isLocalOrUnittest;
    this.manifest = this.config.manifest;
    // publicPath should contain trailing / and leading /
    this.publicPath = this.isLocalOrUnittest ? '/' : normalizePublicPath(this.config.publicPath);
  }

  get host() {
    return this.config.url;
  }

  get resourceBase() {
    return `${this.host}${this.publicPath}`;
  }

  getStyle(entry) {
    entry = entry || this.entryCss;
    return linkTpl({ url: this.getURL(entry) });
  }

  getScript(entry) {
    entry = entry || this.entry;

    let script = '';
    if (this.publicPath) {
      script = `<script>window.__webpack_public_path__ = '${this.publicPath}';</script>`;
    }
    script += scriptTpl({ url: this.getURL(entry) });
    return script;
  }

  getContext(data) {
    data = safeStringify(data || this.assetsContext || {});
    return `<script>(function(){window.${this.config.contextKey} = JSON.parse(decodeURIComponent("${data}"));})()</script>`;
  }

  getURL(entry) {
    let urlpath = entry;
    if (!this.isLocalOrUnittest) {
      urlpath = this.manifest[urlpath];
      assert(urlpath, `Don't find ${entry} in manifest.json`);
    }

    if (urlpath.startsWith('/')) {
      return `${this.host}${urlpath}`;
    }

    if (urlpath.startsWith('http://') || urlpath.startsWith('https://')) {
      return urlpath;
    }

    return `${this.resourceBase}${urlpath}`;
  }

  setEntry(entry) {
    this.entry = entry.replace(/\.jsx?$/, '.js');
    this.entryCss = entry.replace(/\.jsx?$/, '.css');
  }

  setContext(context) {
    this.assetsContext = context;
  }

}

module.exports = Assets;

function linkTpl({ url }) {
  return `<link rel="stylesheet" href="${url}" />`;
}

function scriptTpl({ url }) {
  return `<script src="${url}"></script>`;
}

function safeStringify(data) {
  if (!data) return '';
  return encodeURIComponent(JSON.stringify(data));
}

function normalizePublicPath(publicPath) {
  if (!publicPath) return '/';
  let firstIndex = 0;
  if (publicPath[firstIndex] === '/') firstIndex++;
  let lastIndex = publicPath.length - 1;
  if (publicPath[lastIndex] === '/') lastIndex--;
  return '/' + publicPath.slice(firstIndex, lastIndex + 1) + '/';
}
