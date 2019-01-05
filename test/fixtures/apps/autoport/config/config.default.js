'use strict';

const path = require('path');

exports.keys = '123456';
exports.assets = {
  devServer: {
    waitStart: true,
    autoPort: true,
    command: 'node ' + path.join(__dirname, '../../mocktool/server.js') + ' {port}',
    env: {},
    debug: true,
  },
};
