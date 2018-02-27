'use strict';

const path = require('path');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.js');
  }

  async context() {
    await this.ctx.render('index.js', {
      data: 1,
    });
  }

  async options() {
    await this.ctx.render('index.js', {}, {
      templatePath: path.join(__dirname, '../view/template.ejs'),
      templateViewEngine: 'ejs',
    });
  }

  async cache() {
    await this.ctx.render('index.js', { data: 1 }, {
      templatePath: path.join(__dirname, '../view/template.ejs'),
      templateViewEngine: 'ejs',
    });
  }

  async renderString() {
    await this.ctx.renderString('index.js', { data: 1 });
  }

}

module.exports = HomeController;
