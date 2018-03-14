'use strict';

const cp = require('child_process');
const Base = require('sdk-base');
const detect = require('detect-port');
const sleep = require('mz-modules/sleep');
const awaitEvent = require('await-event');
const debug = require('debug')('egg-view-assets:dev_server');


class DevServer extends Base {
  constructor(app) {
    super({
      initMethod: 'init',
    });
    this.app = app;
    this.isClosed = false;
  }

  async init() {
    // check whether the port is using
    if (await this.checkPortExist()) {
      throw new Error(`port ${this.app.config.assets.devServer.port} has been used`);
    }

    // start dev server asynchronously
    this.startAsync();
    await this.waitListen();
  }

  startAsync() {
    const logger = this.app.coreLogger;
    const { devServer } = this.app.config.assets;
    const [ command, ...args ] = devServer.command.split(/\s+/);

    const env = Object.assign({}, process.env, devServer.env);
    env.PATH = `${this.app.config.baseDir}/node_modules/.bin:${env.PATH}`;
    const opt = {
      stdio: 'pipe',
      env,
    };
    if (devServer.cwd) opt.cwd = devServer.cwd;
    const proc = this.proc = cp.spawn(command, args, opt);

    let stderr = '';
    proc.stderr.on('data', data => {
      stderr += data;
      process.stderr.write(data);
    });
    proc.stdout.on('data', data => {
      if (devServer.debug) process.stdout.write(data);
    });

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

  async checkPortExist() {
    const { devServer } = this.app.config.assets;
    const port = await detect(devServer.port);
    debug('check %s, get result %s', devServer.port, port);
    return port !== devServer.port;
  }

  async waitListen() {
    const logger = this.app.coreLogger;
    const { devServer } = this.app.config.assets;
    let timeout = devServer.timeout / 1000;
    let isSuccess = false;
    while (timeout > 0) {
      if (this.isClosed) {
        /* istanbul ignore next */
        logger.warn('[egg-view-assets] Closing, but devServer is not listened');
        return;
      }
      if (await this.checkPortExist()) {
        logger.warn('[egg-view-assets] Run "%s" success, listen on %s', devServer.command, devServer.port);
        // 成功启动
        isSuccess = true;
        break;
      }
      timeout--;
      await sleep(1000);
      debug('waiting, %s remain', timeout);
    }

    if (isSuccess) return;
    const err = new Error(`Run "${devServer.command}" failed after ${devServer.timeout / 1000}s`);
    throw err;
  }

  async close() {
    this.isClosed = true;
    if (this.proc) {
      this.app.coreLogger.warn('[egg-view-assets] dev server will be killed');
      this.proc.kill();
      await awaitEvent(this.proc, 'exit');
      this.proc = null;
    }
  }
}

module.exports = DevServer;
