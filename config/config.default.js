'use strict';

module.exports = appInfo => {
  return {
    assets: {
      isLocal: appInfo.env === 'local',
      url: '',
      urlPrefix: '',
      templatePath: '',
      templateViewEngine: '',
      template: {
        style: true,
        script: true,
        context: true,
        contextKey: 'context',
        common: false,
      },
      devServer: {
        command: '',
        port: null,
        env: {},
        debug: false,
      },
    },
  };
};
