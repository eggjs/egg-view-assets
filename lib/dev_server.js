'use strict';

const cp = require('child_process');
const Base = require('sdk-base');
const detect = require('detect-port');
const sleep = require('mz-modules/sleep');


class DevServer extends Base {
  constructor(app) {
    super({
      initMethod: 'init',
    });
    this.app = app;
  }

  * init() {
    // 异步启动
    this.startAsync();
    // 检查是否监听端口
    yield this.check();
  }

  startAsync() {
    const logger = this.app.coreLogger;
    const { devServer } = this.app.config.assets;
    const [ command, ...args ] = devServer.split(/\s+/);

    const env = Object.assign({}, process.env);
    env.PATH = `${this.app.config.baseDir}/node_modules/.bin:${env.PATH}`;
    const opt = {
      stdio: 'pipe',
      env,
    };
    const proc = cp.spawn(command, args, opt);

    let stderr = '';
    proc.stderr.on('data', data => {
      stderr += data;
    });

    proc.on('error', err => {
      logger.error(err);
    });
    proc.once('exit', code => {
      const message = `[egg-view-assets] Run "${devServer}" exit with code ${code}`;
      if (code === 0) {
        logger.info(message);
        return;
      }
      const err = new Error(message);
      err.stderr = stderr;
      logger.error(err);
    });
  }

  * check() {
    const logger = this.app.coreLogger;
    const { devServerPort, devServer } = this.app.config.assets;
    let timeout = 60 * 1000;
    let isSuccess = false;
    while (timeout > 0) {
      try {
        yield detect(devServerPort);
        logger.warn(`[egg-view-assets] Run "${devServer}" success, listen on ${devServerPort}`);
        // 成功启动
        isSuccess = true;
        break;
      } catch (_) {
        // nothing
      }
      timeout--;
      sleep(1);
    }

    if (isSuccess) return;
    const err = new Error(`Run "${devServer}" failed after 60s`);
    throw err;
  }

}

module.exports = DevServer;
