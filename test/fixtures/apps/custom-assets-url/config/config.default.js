'use strict';

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  devServer: {
    command: 'echo command',
    port: 8000,
    env: {},
    debug: true,
  },
};
