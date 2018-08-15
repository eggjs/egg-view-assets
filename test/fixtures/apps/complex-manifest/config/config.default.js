'use strict';

const path = require('path');

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
    '.jsx': 'assets',
  },
};
exports.assets = {
  publicPath: '/public/',
  templateViewEngine: 'nunjucks',
  templatePath: path.join(__dirname, '../app/view/layout.html'),
};
