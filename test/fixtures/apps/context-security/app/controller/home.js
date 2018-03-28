'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.js', {
      query: this.ctx.query.query,
    });
  }
}

module.exports = HomeController;
