'use strict';

const net = require('net');
const path = require('path');
const mock = require('egg-mock');
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
      cache: false,
    });
    // app.debug();
    await app.ready();
    const reg = new RegExp(`Run "${path.join(__dirname, 'fixtures/apps/mocktool/server')}" success, listen on 8000`);
    app.expect('stdout', reg);

    await app.close();
    app.expect('stdout', /\[egg-view-assets] dev server will be killed/);
    app.expect('stdout', /server stopped/);
  });

  it('should check first when port has been listened', async () => {
    mock.env('local');
    const server = new net.Server();
    server.listen(8000);
    app = mock.cluster({
      baseDir: 'apps/assets',
      cache: false,
    });
    // app.debug();
    try {
      await app.ready();
    } catch (err) {
      console.log(err);
    } finally {
      server.close();
    }

    app.notExpect('stdout', /listen on 8000/);
    app.expect('stderr', /port 8000 has been used/);
    app.expect('stdout', /egg started on http:\/\/127.0.0.1:\d+/);
  });

  it('should log error when run command error', async () => {

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

    app.expect('stderr', /Run "echo command" failed after 60s/);
  });

});
