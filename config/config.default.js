'use strict';

const path = require('path');

exports.assets = {
  url: 'http://127.0.0.1:7001',
  templatePath: path.join(__dirname, '../lib/template.html'),
  templateViewEngine: 'nunjucks',
  devServer: 'roadhog server',
  devServerPort: '8000',
};
