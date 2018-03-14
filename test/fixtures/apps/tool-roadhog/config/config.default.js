'use strict';

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  devServer: {
    waitStart: true,
    command: 'roadhog dev',
    port: 8000,
  },
};
