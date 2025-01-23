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
    this.crossorigin = this.config.crossorigin;
    // publicPath should contain trailing / and leading /
    this.publicPath = this.isLocalOrUnittest ? '/' : normalizePublicPath(this.config.publicPath);
    // make sure __webpack_public_path__ inserted just once
    this.hasWebpackGlobalVariableInserted = false;
    this.host = this.config.url;
    this.resourceBase = `${this.host}${this.publicPath}`;
    this.nonce = this.config.nonce && this.config.nonce(this.ctx);
  }

  getStyle(entry) {
    entry = entry || this.entryCss;
    return linkTpl({
      url: this.getURL(entry),
      crossorigin: this.crossorigin,
    });
  }

  getScript(entry) {
    entry = entry || this.entry;

    let script = '';

    const webpackPublicPath = this.config.resourcePathToURL ? this.resourceBase : this.publicPath;
    if (webpackPublicPath && !this.hasWebpackGlobalVariableInserted) {
      script = inlineScriptTpl(`window.__webpack_public_path__ = '${webpackPublicPath}';`, this.nonce);
      this.hasWebpackGlobalVariableInserted = true;
    }

    script += scriptTpl({
      url: this.getURL(entry),
      crossorigin: this.crossorigin,
    });

    return script;
  }

  getContext(data) {
    data = safeStringify(data || this.assetsContext || {});
    return inlineScriptTpl(`(function(){window.${this.config.contextKey} = JSON.parse(decodeURIComponent("${data}"));})()`, this.nonce);
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

function linkTpl({ url, crossorigin }) {
  return crossorigin ? `<link rel="stylesheet" href="${url}" crossorigin="anonymous" />` : `<link rel="stylesheet" href="${url}" />`;
}

function scriptTpl({ url, crossorigin }) {
  return '<script' + (crossorigin ? ' crossorigin' : '') + ` src="${url}"></script>`;
}

function inlineScriptTpl(content, nonce) {
  const startTag = nonce ? `<script nonce=${nonce}>` : '<script>';
  return `${startTag}${content}</script>`;
}

function safeStringify(data) {
  if (!data) return '';
  return encodeURIComponent(JSON.stringify(data));
}

function normalizePublicPath(publicPath) {
  if (!publicPath) return '/';
  if (publicPath === '/') return publicPath;

  let firstIndex = 0;
  if (publicPath[firstIndex] === '/') firstIndex++;
  let lastIndex = publicPath.length - 1;
  if (publicPath[lastIndex] === '/') lastIndex--;
  return '/' + publicPath.slice(firstIndex, lastIndex + 1) + '/';
}
