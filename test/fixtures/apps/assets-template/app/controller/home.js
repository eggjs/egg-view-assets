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
    console.log(1111);
    await this.ctx.render('index.js', {}, {
      templatePath: path.join(__dirname, '../view/template.ejs'),
      templateViewEngine: 'ejs',
    });
  }

}

module.exports = HomeController;
