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
    // check whether the port is using
    yield this.check();

    // start dev server asynchronously
    this.startAsync();
    yield this.waitListen();
  }

  startAsync() {
    const logger = this.app.coreLogger;
    const { devServer } = this.app.config.assets;
    const [ command, ...args ] = devServer.command.split(/\s+/);

    const env = Object.assign({}, process.env, devServer.env);
    env.PATH = `${this.app.config.baseDir}/node_modules/.bin:${env.PATH}`;
    const opt = {
      stdio: 'inherit',
      env,
    };
    if (devServer.cwd) opt.cwd = devServer.cwd;
    const proc = this.proc = cp.spawn(command, args, opt);

    const stderr = '';
    // proc.stderr.on('data', data => {
    //   stderr += data;
    // });

    proc.on('error', err => {
      logger.error(err);
    });
    proc.once('exit', code => {
      const message = `[egg-view-assets] Run "${devServer.command}" exit with code ${code}`;
      if (code > 0) {
        const err = new Error(message);
        err.stderr = stderr;
        logger.error(err);
        return;
      }
      logger.info(message);
    });
  }

  * check() {
    const { devServer } = this.app.config.assets;
    try {
      yield detect(devServer.port);
    } catch (_) {
      throw new Error(`Port ${devServer.port} has been used`);
    }
  }

  * waitListen() {
    const logger = this.app.coreLogger;
    const { devServer } = this.app.config.assets;
    let timeout = 60;
    let isSuccess = false;
    while (timeout > 0) {
      try {
        yield this.check();
        logger.warn(`[egg-view-assets] Run "${devServer.command}" success, listen on ${devServer.port}`);
        // 成功启动
        isSuccess = true;
        break;
      } catch (_) {
        // nothing
      }
      timeout--;
      sleep(1000);
    }

    if (isSuccess) return;
    const err = new Error(`Run "${devServer.command}" failed after 60s`);
    throw err;
  }

  * close() {
    if (this.proc) {
      this.proc.kill();
      yield sleep(1000);
      console.log(1111);
      this.app.coreLogger.info('[egg-view-assets] dev server be killed');
    }
  }
}

module.exports = DevServer;
