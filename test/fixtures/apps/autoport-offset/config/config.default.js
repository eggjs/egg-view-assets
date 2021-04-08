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
    port: 8000,
    command: 'node ' + path.join(__dirname, '../../mocktool/server.js') + ' {port}',
    env: {
      SOCKET_SERVER: 'http://127.0.0.1:{port}',
    },
    debug: true,
  },
};
