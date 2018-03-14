'use strict';

module.exports = appInfo => {
  return {
    assets: {
      isLocal: appInfo.env === 'local',
      url: '',
      publicPath: '',
      templatePath: '',
      templateViewEngine: '',
      contextKey: 'context',
      devServer: {
        waitStart: false,
        command: '',
        port: null,
        env: {},
        debug: false,
      },
    },
  };
};
