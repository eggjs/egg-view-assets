'use strict';

const net = require('net');
const path = require('path');
const mock = require('egg-mock');
const assert = require('assert');
const sleep = require('mz-modules/sleep');

describe('test/dev_server.test.js', () => {

  let app;
  afterEach(mock.restore);
  afterEach(() => app.close());
  afterEach(() => sleep(5000));

  it('should start/stop dev server', async () => {
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/assets',
    });
    app.debug();
    await app.ready();
    const reg = new RegExp(`Run "node ${path.join(__dirname, 'fixtures/apps/mocktool/server.js')}" success, listen on 8000`);
    app.expect('stdout', reg);

    await app.close();
    app.expect('stdout', /\[egg-view-assets] dev server will be killed/);
    app.expect('stdout', /server stopped/);
    app.expect('stderr', /\[server] error/);
  });

  it('should check first when port has been listened', async () => {
    mock.env('local');
    const server = new net.Server();
    server.listen(8000);
    app = mock.cluster({
      baseDir: 'apps/assets',
    });
    // app.debug();
    await app.ready();
    app.notExpect('stdout', /listen on 8000/);
    app.expect('stderr', /port 8000 has been used/);
    app.expect('stderr', /\[agent_worker] start error/);
    server.close();
  });

  it('should success when run command', async () => {
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/not-listen',
    });
    app.debug();
    await app.ready();

    await app.close();
    await sleep(5000);

    // app.expect('stdout', /Closing, but devServer is not listened/);
  });

  it('should custom devServer.cwd', async () => {
    mock(process.env, 'DEV_SERVER_DEBUG', true);
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/custom-dev-server',
    });
    app.debug();
    await app.ready();

    assert(app.stdout.includes('[server] cwd: ' + path.join(__dirname, 'fixtures/apps/custom-dev-server/config')));
  });

  it('should custom devServer.env', async () => {
    mock(process.env, 'DEV_SERVER_DEBUG', true);
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/custom-dev-server',
    });
    app.debug();
    await app.ready();

    assert(app.stdout.includes('[server] DEBUG: true'));
  });

  it('should disable devServer.debug', async () => {
    mock(process.env, 'DEV_SERVER_DEBUG', false);
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/custom-dev-server',
    });
    app.debug();
    await app.ready();

    assert(!app.stdout.includes(path.join(__dirname, 'fixtures/apps/custom-dev-server/config')));
  });

  it('should log error when run command error', async () => {
    mock(process.env, 'DEV_SERVER_DEBUG', true);
    mock(process.env, 'EXIT', true);
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/custom-dev-server',
    });
    app.debug();
    await app.ready();

    const server = path.join(__dirname, 'fixtures/apps/custom-dev-server/config/server.js');
    const errMsg = `[egg-view-assets] Run "node ${server}" exit with code 1`;
    assert(app.stderr.includes(errMsg));
  });

  it('should wait timeout', async () => {
    mock(process.env, 'DEV_SERVER_DEBUG', true);
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/custom-dev-server',
    });
    app.debug();
    await app.ready();

    await sleep(10000);
    const server = path.join(__dirname, 'fixtures/apps/custom-dev-server/config/server.js');
    const errMsg = `[egg-view-assets] Run "node ${server}" failed after 5s`;
    assert(app.stderr.includes(errMsg));
  });

  it('should throw when command error', async () => {
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/command-error',
    });
    app.debug();
    await app.ready();

    app.expect('stderr', /spawn unknown ENOENT/);
    app.expect('stderr', /Run "unknown command" failed after 5s/);
  });

  it('should check port when devServer is enabled', async () => {
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/dev-server-no-port',
    });
    // app.debug();
    await app.ready();

    app.expect('code', 1);
    app.expect('stderr', /port or autoPort is required when devServer is enabled/);
  });

  it('should not check port when devServer is disabled', async () => {
    mock.env('local');
    mock(process.env, 'DEV_SERVER_ENABLE', 'false');
    app = mock.cluster({
      baseDir: 'apps/dev-server-no-port',
    });
    app.debug();
    await app.ready();

    app.expect('code', 0);
    app.expect('stdout', /egg started/);
  });

  it('should auto check port with autoPort', async () => {
    mock.env('local');
    const app1 = mock.cluster({
      baseDir: 'apps/autoport',
    });
    // app1.debug();
    await app1.ready();

    await app1.httpRequest()
      .get('/')
      .expect(/http:\/\/127.0.0.1:10000\/index.js/)
      .expect(200);
    await app1.httpRequest()
      .get('/port')
      .expect('10000')
      .expect(200);

    app1.expect('stdout', /\[server] listening 10000/);
    app1.expect('stdout', /\[server] SOCKET_SERVER: http:\/\/127.0.0.1:10000/);

    app = mock.cluster({
      baseDir: 'apps/autoport',
    });
    // app.debug();
    try {
      await app.ready();

      app.expect('stdout', /\[server] listening 10001/);
    } finally {
      await app1.close();
    }
  });

  it('should auto check port with autoPort and port offset', async () => {
    mock.env('local');
    const app1 = mock.cluster({
      baseDir: 'apps/autoport-offset',
    });

    await app1.ready();

    await app1.httpRequest()
      .get('/')
      .expect(/http:\/\/127.0.0.1:8000\/index.js/)
      .expect(200);
    await app1.httpRequest()
      .get('/port')
      .expect('8000')
      .expect(200);

    app1.expect('stdout', /\[server] listening 8000/);
    app1.expect('stdout', /\[server] SOCKET_SERVER: http:\/\/127.0.0.1:8000/);

    app = mock.cluster({
      baseDir: 'apps/autoport-offset',
    });
    // app.debug();
    try {
      await app.ready();

      app.expect('stdout', /\[server] listening 8001/);
    } finally {
      await app1.close();
    }
  });
});
