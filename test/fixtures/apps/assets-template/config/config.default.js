'use strict';

const path = require('path');

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  templatePath: path.join(__dirname, '../app/view/template.html'),
  templateViewEngine: 'nunjucks',
  devServer: {
    waitStart: true,
    command: 'node ' + path.join(__dirname, '../../mocktool/server.js'),
    port: 8000,
    env: {},
    debug: true,
  },
};
