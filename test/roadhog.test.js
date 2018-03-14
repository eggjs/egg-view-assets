'use strict';

const mock = require('egg-mock');
const request = require('supertest');
const sleep = require('mz-modules/sleep');

describe.skip('roadhog', () => {
  let app;
  before(() => {
    mock.env('local');
    app = mock.cluster({
      baseDir: 'apps/tool-roadhog',
    });
    return app.ready();
  });
  after(() => app.close());

  it('should GET /', async () => {
    await app.httpRequest()
      .get('/')
      .expect(res => {
        res.text.includes('<link rel="stylesheet" href="http://127.0.0.1:8000/index.css"></link>');
        res.text.includes('<script src="http://127.0.0.1:8000/index.js"></script>');
        // res.text.includes('<script>window.context={}</script>');
      })
      .expect(200);

    await sleep(10000);

    await request('http://127.0.0.1:8000')
      .get('index.js')
      .expect(res => {
        console.log(res);
      });
  });
});
