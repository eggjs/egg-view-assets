'use strict';

const path = require('path');

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  publicPath: '/app/public',
  devServer: {
    command: path.join(__dirname, '../../mocktool/server'),
    port: 8000,
    env: {},
    debug: true,
  },
};
