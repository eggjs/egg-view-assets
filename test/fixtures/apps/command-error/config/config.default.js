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
    command: 'unknown command',
    port: 8000,
    debug: true,
    timeout: 5000,
  },
};
