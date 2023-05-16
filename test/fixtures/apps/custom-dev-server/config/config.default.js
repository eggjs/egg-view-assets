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
    command: 'node ' + require.resolve('./server.js'),
    cwd: __dirname,
    port: 8000,
    env: {
      NODE_DEBUG: true,
    },
    timeout: 5000,
    debug: process.env.DEV_SERVER_DEBUG === 'true',
  },
};
