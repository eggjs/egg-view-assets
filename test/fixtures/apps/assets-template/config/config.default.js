'use strict';

const path = require('path');

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  url: 'http://cdn.com',
  templatePath: path.join(__dirname, '../app/view/template.html'),
  templateViewEngine: 'nunjucks',
  devServer: {
    command: path.join(__dirname, '../../mocktool/server'),
    port: 8000,
    env: {},
  },
};
