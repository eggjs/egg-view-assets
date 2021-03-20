'use strict';

const path = require('path');
const fs = require('mz/fs');
const spawn = require('cross-spawn');
const Base = require('sdk-base');
const detect = require('detect-port');
const sleep = require('mz-modules/sleep');
const awaitEvent = require('await-event');
const debug = require('debug')('egg-view-assets:dev_server');
const detectPort = require('detect-port');
const mkdirp = require('mz-modules/mkdirp');
const is = require('is-type-of');


class DevServer extends Base {
  constructor(app) {
    super({
      initMethod: 'init',
    });
    this.app = app;
    this.isClosed = false;
  }

  async init() {
    const { devServer } = this.app.config.assets;

    if (devServer.autoPort) {
      devServer.port = await detectPort(10000);
      await mkdirp(path.dirname(devServer.portPath));
      await fs.writeFile(devServer.portPath, devServer.port.toString());
    } else {
      // check whether the port is using
      if (await this.checkPortExist()) {
        throw new Error(`port ${this.app.config.assets.devServer.port} has been used`);
      }
    }

    // start dev server asynchronously
    this.startAsync();
    await this.waitListen();
  }

  startAsync() {
    const { devServer } = this.app.config.assets;
    devServer.command = this.replacePort(devServer.command);
    const [ command, ...args ] = devServer.command.split(/\s+/);

    const env = Object.assign({}, process.env, devServer.env);
    env.PATH = `${this.app.config.baseDir}/node_modules/.bin:${env.PATH}`;
    // replace {port}
    Object.keys(env).forEach(key => {
      env[key] = this.replacePort(env[key]);
    });
    const opt = {
      // disable stdout by default
      stdio: [ 'inherit', 'ignore', 'inherit' ],
      env,
    };
    if (devServer.cwd) opt.cwd = devServer.cwd;
    if (devServer.debug) opt.stdio[1] = 'inherit';
    const proc = this.proc = spawn(command, args, opt);
    proc.once('error', err => this.exit(err));
    proc.once('exit', code => this.exit(code));
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

  exit(codeOrError) {
    const logger = this.app.coreLogger;
    this.proc = null;

    if (!(codeOrError instanceof Error)) {
      const { devServer } = this.app.config.assets;
      const code = codeOrError;
      const message = `[egg-view-assets] Run "${devServer.command}" exit with code ${code}`;
      if (!code || code === 0) {
        logger.info(message);
        return;
      }

      codeOrError = new Error(message);
    }

    logger.error(codeOrError);
  }

  replacePort(str) {
    if (!is.string(str)) return str;
    return str.replace('{port}', this.app.config.assets.devServer.port);
  }

}

module.exports = DevServer;
