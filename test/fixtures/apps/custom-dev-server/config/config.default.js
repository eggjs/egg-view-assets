'use strict';

exports.keys = '123456';
exports.view = {
  mapping: {
    '.js': 'assets',
  },
};
exports.assets = {
  devServer: {
    command: require.resolve('./server.js'),
    cwd: __dirname,
    port: 8000,
    env: {
      DEBUG: true,
    },
    timeout: 5000,
    debug: process.env.DEV_SERVER_DEBUG === 'true',
  },
};
