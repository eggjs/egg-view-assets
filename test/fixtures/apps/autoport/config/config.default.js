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
  devServer: {
    waitStart: true,
    autoPort: true,
    command: 'node ' + path.join(__dirname, '../../mocktool/server.js') + ' {port}',
    env: {},
    debug: true,
  },
};
