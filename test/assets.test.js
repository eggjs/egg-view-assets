'use strict';

const mock = require('egg-mock');
const request = require('supertest');
const sleep = require('mz-modules/sleep');


describe('test/assets.test.js', () => {

  afterEach(mock.restore);

  describe.only('AssetsView with default template', () => {

    describe('in local', () => {
      let app;

      before(() => {
        mock.env('local');
        app = mock.app({
          baseDir: 'apps/assets',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css"><\/link>/)
          .expect(/<script>window.context = {}<\/script>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(200);
      });

      it('should render context', () => {
        return app.httpRequest()
          .get('/context')
          .expect(/<script>window.context = {"data":1}<\/script>/)
          .expect(200);
      });
    });
  });

  describe('AssetsView with custom template', () => {
  });

  describe.skip('roadhog', () => {
    let app;
    before(() => {
      mock.env('local');
      app = mock.app({
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

});
