'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.js');
  }

  async port() {
    this.ctx.body = this.app.config.assets.devServer.port;
  }
}

module.exports = HomeController;
