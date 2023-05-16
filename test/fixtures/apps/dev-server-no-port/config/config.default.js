'use strict';

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  devServer: {
    enable: process.env.DEV_SERVER_ENABLE !== 'false',
    waitStart: true,
    command: 'node ' + require.resolve('./server.js'),
    cwd: __dirname,
    env: {
      NODE_DEBUG: true,
    },
    timeout: 5000,
    debug: process.env.DEV_SERVER_DEBUG === 'true',
  },
};
