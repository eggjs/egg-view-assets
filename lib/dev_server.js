'use strict';

const spawn = require('cross-spawn');
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
    const { devServer } = this.app.config.assets;
    const [ command, ...args ] = devServer.command.split(/\s+/);

    let stderr = '';
    if (process.stderr) {
      process.stderr.on('data', data => {
        stderr += data;
      });
    }

    const env = Object.assign({}, process.env, devServer.env);
    env.PATH = `${this.app.config.baseDir}/node_modules/.bin:${env.PATH}`;
    const opt = {
      // disable stderr by default
      stdio: [ 'inherit', 'inherit', 'ignore' ],
      env,
    };
    if (devServer.cwd) opt.cwd = devServer.cwd;
    if (devServer.debug) opt.stdio[2] = 'inherit';
    const proc = this.proc = spawn(command, args, opt);
    proc.once('error', err => this.exit(err, stderr));
    proc.once('exit', code => this.exit(code, stderr));
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
      /* istanbul ignore if */
      if (this.isClosed) {
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
    /* istanbul ignore if */
    if (!this.proc) return;
    this.app.coreLogger.warn('[egg-view-assets] dev server will be killed');
    this.proc.kill();
    await awaitEvent(this.proc, 'exit');
    this.proc = null;
  }

  exit(codeOrError, stderr) {
    const logger = this.app.coreLogger;
    this.proc = null;

    if (!(codeOrError instanceof Error)) {
      const { devServer } = this.app.config.assets;
      const code = codeOrError;
      const message = `[egg-view-assets] Run "${devServer.command}" exit with code ${code}`;
      if (code === 0) {
        logger.info(message);
        return;
      }

      codeOrError = new Error(message);
    }

    codeOrError.stderr = stderr;
    logger.error(codeOrError);
  }
}

module.exports = DevServer;
