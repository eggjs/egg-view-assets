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
  publicPath: '/app/public',
  devServer: {
    waitStart: true,
    command: 'node ' + path.join(__dirname, '../../mocktool/server.js'),
    port: 8000,
    env: {},
    debug: true,
  },
  nonce(ctx) {
    return ctx.cspnonce;
  },
};
