'use strict';

const path = require('path');

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  publicPath: '/public/',
  url: 'http://example.com',
  crossorigin: true,
  templateViewEngine: 'nunjucks',
  templatePath: path.join(__dirname, '../app/view/layout.html'),
};
