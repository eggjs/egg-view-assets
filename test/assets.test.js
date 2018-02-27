'use strict';

const path = require('path');
const mock = require('egg-mock');
const fs = require('mz/fs');


describe('test/assets.test.js', () => {

  afterEach(mock.restore);

  describe('AssetsView with default template', () => {
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

  describe('AssetsView with custom template', () => {
    let app;

    before(() => {
      mock.env('local');
      app = mock.app({
        baseDir: 'apps/assets-template',
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

    it('should use template from render options', () => {
      return app.httpRequest()
        .get('/options')
        .expect(/<div id="root"><\/div>/)
        .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css"><\/link>/)
        .expect(/<script>window.context = {}<\/script>/)
        .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
        .expect(200);
    });

    it('should use cache when template exist', async () => {
      const template = path.join(__dirname, 'fixtures/apps/assets-template/app/view/cache.html');
      await fs.writeFile(template, '{{ data }}');

      await app.httpRequest()
        .get('/cache')
        .expect(/{"data":1}/)
        .expect(200);

      await fs.writeFile(template, 'override');

      await app.httpRequest()
        .get('/cache')
        .expect(/{"data":1}/)
        .expect(200);
    });

    it('should throw when call renderString', () => {
      return app.httpRequest()
        .get('/renderString')
        .expect(/Can\\&#39;t find viewEngine/)
        .expect(500);
    });
  });

  describe('production', () => {
    let app;

    before(() => {
      mock.env('prod');
      app = mock.app({
        baseDir: 'apps/assets',
      });
      return app.ready();
    });

    it('should', async () => {

    });

  });
});
