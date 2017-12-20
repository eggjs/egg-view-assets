'use strict';

const cp = require('child_process');

module.exports = agent => {
  const assetsConfig = agent.config.assets;
  const devServer = assetsConfig.devServer;

  const env = Object.assign({}, process.env);
  env.PATH = `${process.cwd()}/node_modules/.bin:${env.PATH}`;
  console.log(env.PATH);
  const p = cp.spawn('roadhog', [ 'server' ], { env, stdio: 'inherit' });
  p.on('exit', e => console.log(e));
};
