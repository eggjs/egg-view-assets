'use strict';

const fs = require('fs');

module.exports = app => {
  const assetsConfig = app.config.assets;
  const templateStr = fs.readFileSync(assetsConfig.templatePath, 'utf8');
  const viewEngine = assetsConfig.templateViewEngine;
  const devServerPort = assetsConfig.devServerPort;

  assetsConfig.url = 'http://127.0.0.1:' + devServerPort;

  class AssetsView {
    constructor(ctx) {
      this.ctx = ctx;
    }

    * render(name, data, options) {
      this.ctx.locals = {
        assetsUrl: assetsConfig.url,
        entry: options.name,
        entryCss: options.name.replace(/\.js$/, '.css'),
        context: JSON.stringify(data),
      };

      const content = yield this.ctx.renderString(templateStr, {}, { viewEngine });
      return content;
    }
    * renderString(name, data, options) {
      console.log(name, data, options);
    }
  }

  app.view.use('assets', AssetsView);
};
