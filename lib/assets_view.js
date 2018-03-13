'use strict';

const fs = require('mz/fs');
const TEMPLATE_CACHE = Symbol('AssetsView#templateCache');
const HELPER_ASSETS = require('./constant').HELPER_ASSETS;

class AssetsView {
  constructor(ctx) {
    this.ctx = ctx;
    this.config = ctx.app.config.assets;
    this.logger = ctx.coreLogger;

    if (!ctx.app[TEMPLATE_CACHE]) ctx.app[TEMPLATE_CACHE] = new Map();
    this.cache = ctx.app[TEMPLATE_CACHE];
  }

  async render(name, locals, options) {
    const templateViewEngine = options.templateViewEngine || this.config.templateViewEngine;
    const templatePath = options.templatePath || this.config.templatePath;

    const assets = this.ctx.helper.assets;
    assets.setEntry(options.name);
    assets.setContext(options.locals);
    this.ctx[HELPER_ASSETS] = assets;

    if (templateViewEngine && templatePath) {
      const templateStr = await this.readFileWithCache(templatePath);
      this.logger.info('[egg-view-assets] use %s to render %s, entry is %s',
        templateViewEngine, templatePath, name);
      return await this.ctx.renderString(templateStr, locals, {
        viewEngine: templateViewEngine,
      });
    }

    return renderDefault(assets);
  }

  async readFileWithCache(filepath) {
    let str = this.cache.get(filepath);
    if (str) return str;

    str = await fs.readFile(filepath, 'utf8');
    this.cache.set(filepath, str);
    return str;
  }

  async renderString() {
    throw new Error('assets engine don\'t support renderString');
  }

}

module.exports = AssetsView;

function renderDefault(assets) {
  return `
  <!doctype html>
  <html>
    <head>
      ${assets.getStyle()}
    </head>
    <body>
      <div id="root"></div>
      ${assets.getContext()}
      ${assets.getScript()}
    </body>
  </html>
  `;
}
