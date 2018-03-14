'use strict';

const path = require('path');
const mock = require('egg-mock');
const fs = require('mz/fs');


describe.only('test/assets.test.js', () => {

  afterEach(mock.restore);

  describe('AssetsView with default template', () => {
    let app;

    describe('local', () => {
      before(() => {
        mock.env('local');
        app = mock.cluster({
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
          .expect(/<script>window.context = {"data":1};<\/script>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(/<script>window.__webpack__public_path__ = '\/app\/public';<\/script>/)
          .expect(200);
      });
    });

    describe('production', () => {
      let app;

      before(() => {
        mock.env('prod');
        app = mock.cluster({
          baseDir: 'apps/assets',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/cdn.com\/app\/public\/index.b8e2efea.css"><\/link>/)
          .expect(/<script>window.context = {"data":1};<\/script>/)
          .expect(/<script src="http:\/\/cdn.com\/app\/public\/index.c4ae6394.js"><\/script>/)
          .expect(/<script>window.__webpack__public_path__ = '\/app\/public';<\/script>/)
          .expect(200);
      });
    });
  });

  describe('AssetsView with custom template', () => {
    let app;

    describe('local', () => {
      before(() => {
        mock.env('local');
        app = mock.cluster({
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
          .expect(/<script>window.context = {};<\/script>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(200);
      });

      it('should render context', () => {
        return app.httpRequest()
          .get('/context')
          .expect(/<script>window.context = {"data":1};<\/script>/)
          .expect(200);
      });

      it('should use template from render options', () => {
        return app.httpRequest()
          .get('/options')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css"><\/link>/)
          .expect(/<script>window.context = {};<\/script>/)
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

    describe('prod', () => {
      before(() => {
        mock.env('prod');
        app = mock.cluster({
          baseDir: 'apps/assets-template',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/cdn.com\/index.b8e2efea.css"><\/link>/)
          .expect(/<script>window.context = {};<\/script>/)
          .expect(/<script src="http:\/\/cdn.com\/index.c4ae6394.js"><\/script>/)
          .expect(200);
      });
    });
  });

  describe('in other view engine', () => {
    let app;

    describe('local', () => {
      before(() => {
        mock.env('local');
        app = mock.cluster({
          baseDir: 'apps/other-view-engine',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css"><\/link>/)
          .expect(/<script>window.context = {"data":1};<\/script>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(/<script>window.__webpack__public_path__ = '\/app\/public';<\/script>/)
          .expect(/<script>window.resourceBaseUrl = 'http:\/\/127.0.0.1:8000\/';<\/script/)
          .expect(200);
      });
    });

    describe('prod', () => {
      before(() => {
        mock.env('prod');
        app = mock.cluster({
          baseDir: 'apps/other-view-engine',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<link rel="stylesheet" href="http:\/\/cdn.com\/app\/public\/index.b8e2efea.css"><\/link>/)
          .expect(/<script>window.context = {"data":1};<\/script>/)
          .expect(/<script src="http:\/\/cdn.com\/app\/public\/index.c4ae6394.js"><\/script>/)
          .expect(/<script>window.__webpack__public_path__ = '\/app\/public';<\/script>/)
          .expect(/<script>window.resourceBaseUrl = 'http:\/\/cdn.com\/app\/public\/';<\/script/)
          .expect(200);
      });
    });
  });

  describe('custom assets.url', () => {
    let app;

    before(() => {
      mock.env('local');
      app = mock.cluster({
        baseDir: 'apps/custom-assets-url',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should GET /', () => {
      return app.httpRequest()
        .get('/')
        .expect(/<link rel="stylesheet" href="http:\/\/localhost\/index.css"><\/link>/)
        .expect(200);
    });
  });

  describe('custom contextKey', () => {
    let app;

    before(() => {
      mock.env('local');
      app = mock.cluster({
        baseDir: 'apps/custom-context-key',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should GET /', () => {
      return app.httpRequest()
        .get('/')
        .expect(/<script>window.__context__ = {};<\/script>/)
        .expect(200);
    });
  });
});
