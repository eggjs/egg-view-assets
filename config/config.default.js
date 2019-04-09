'use strict';

const path = require('path');

module.exports = appInfo => ({
  /**
   * assets options
   * @member Config#assets
   * @property {String} url - the host of the assets, it will be `127.0.0.1:${devServer.port}` in development.
   * @property {String} publicPath - the base path of the assets
   * @property {String} templatePath - the file path of template rendering html
   * @property {String} templateViewEngine - the view engine for rendering template
   * @property {Boolean} contextKey - the property name of context, default is `context`
   * @property {Boolean} devServer - configuration of local assets server
   * @property {Boolean} devServer.command - a command for starting a server, such as `webpack`
   * @property {Boolean} devServer.port - listening port for the server, it will be checked when starting
   * @property {Boolean} devServer.timeout - the timeout for checking listening port
   * @property {Boolean} devServer.env - custom environment
   * @property {Boolean} devServer.debug - show stdout/stderr for devServer
   * @property {Boolean} devServer.waitStart - whether wait devServer starting
   */
  assets: {
    isLocalOrUnittest: appInfo.env === 'local' || appInfo.env === 'unittest',
    url: '',
    publicPath: '',
    templatePath: '',
    templateViewEngine: '',
    crossorigin: false,
    contextKey: 'context',
    devServer: {
      enable: true,
      command: '',
      autoPort: false,
      port: null,
      portPath: path.join(appInfo.baseDir, 'run/assetsPort'),
      env: {},
      debug: false,
      timeout: 60 * 1000,
      waitStart: false,
    },
  },
});
