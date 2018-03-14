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
    debug: process.env.DEV_SERVER_DEBUG === 'true',
  },
};
