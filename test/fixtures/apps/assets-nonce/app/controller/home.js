'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.js', {
      data: 1,
    });
  }

  async account() {
    await this.ctx.render('account.jsx');
  }

  async renderString() {
    await this.ctx.renderString('', {}, {
      viewEngine: 'assets',
    });
  }
}

module.exports = HomeController;
