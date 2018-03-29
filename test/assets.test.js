'use strict';

const path = require('path');
const mock = require('egg-mock');
const fs = require('mz/fs');
const assert = require('assert');


describe('test/assets.test.js', () => {

  afterEach(mock.restore);

  describe('AssetsView with default template', () => {
    let app;

    describe('local', () => {
      before(() => {
        mock.env('local');
        app = mock.cluster({
          baseDir: 'apps/assets',
        });
        // app.debug();
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css"><\/link>/)
          .expect(/style="display:none">{"data":1}<\/div>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = '\/';<\/script>/)
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
          .expect(/style="display:none">{"data":1}<\/div>/)
          .expect(/<script src="http:\/\/cdn.com\/app\/public\/index.c4ae6394.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = '\/app\/public\/';<\/script>/)
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
          .expect(/style="display:none"><\/div>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(200);
      });

      it('should render context', () => {
        return app.httpRequest()
          .get('/context')
          .expect(/style="display:none">{"data":1}<\/div>/)
          .expect(200);
      });

      it('should use template from render options', () => {
        return app.httpRequest()
          .get('/options')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css"><\/link>/)
          .expect(/style="display:none">{}<\/div>/)
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
          .expect(/assets engine don&#39;t support renderString/)
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
          .expect(/style="display:none"><\/div>/)
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
          .expect(/style="display:none">{"data":1}<\/div>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = '\/';<\/script>/)
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
          .expect(/style="display:none">{"data":1}<\/div>/)
          .expect(/<script src="http:\/\/cdn.com\/app\/public\/index.c4ae6394.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = '\/app\/public\/';<\/script>/)
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
        .expect(/<script>window.__context__ =/)
        .expect(200);
    });
  });

  describe('context security', () => {
    let app;

    before(() => {
      app = mock.cluster({
        baseDir: 'apps/context-security',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should GET /', () => {
      return app.httpRequest()
        .get('/?query=<x%E2%80%A8x>')
        .expect(/<div id="[^"]+" style="display:none">\{"query":"&lt;x\u2028x&gt;"\}<\/div>/)
        .expect(/window.context = JSON.parse\(document.getElementById\('[^']+'\).textContent \|\| '\{\}'\);/)
        .expect(200);
    });
  });

  describe('publicPath', () => {
    let app;

    describe('local', () => {
      before(() => {
        mock.env('local');
        app = mock.app({
          baseDir: 'apps/custom-public-path',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should render with trailing /', () => {
        mock(app.config.assets, 'publicPath', '/public/');

        let ctx = app.mockContext();
        ctx.helper.assets.setEntry('index.js');
        let script = ctx.helper.assets.getScript();
        assert(script.includes('__webpack_public_path__ = \'/\';'));
        assert(script.includes('src="/index.js"'));
        let style = ctx.helper.assets.getStyle();
        assert(style.includes('href="/index.css"'));

        ctx = app.mockContext();
        script = ctx.helper.assets.getScript('index.js');
        assert(script.includes('__webpack_public_path__ = \'/\';'));
        assert(script.includes('src="/index.js"'));
        style = ctx.helper.assets.getStyle('index.css');
        assert(style.includes('href="/index.css"'));
      });

      it('should render without trailing /', () => {
        mock(app.config.assets, 'publicPath', '/public');

        let ctx = app.mockContext();
        ctx.helper.assets.setEntry('index.js');
        let script = ctx.helper.assets.getScript();
        assert(script.includes('__webpack_public_path__ = \'/\';'));
        assert(script.includes('src="/index.js"'));
        let style = ctx.helper.assets.getStyle();
        assert(style.includes('href="/index.css"'));

        ctx = app.mockContext();
        script = ctx.helper.assets.getScript('index.js');
        assert(script.includes('__webpack_public_path__ = \'/\';'));
        assert(script.includes('src="/index.js"'));
        style = ctx.helper.assets.getStyle('index.css');
        assert(style.includes('href="/index.css"'));
      });
    });

    describe('prod', () => {
      before(() => {
        mock.env('prod');
        app = mock.app({
          baseDir: 'apps/custom-public-path',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should render with trailing /', () => {
        mock(app.config.assets, 'publicPath', '/public/');

        let ctx = app.mockContext();
        ctx.helper.assets.setEntry('index.js');
        let script = ctx.helper.assets.getScript();
        assert(script.includes('__webpack_public_path__ = \'/public/\';'));
        assert(script.includes('src="/public/index.js"'));
        let style = ctx.helper.assets.getStyle();
        assert(style.includes('href="/public/index.css"'));

        ctx = app.mockContext();
        script = ctx.helper.assets.getScript('index.js');
        assert(script.includes('__webpack_public_path__ = \'/public/\';'));
        assert(script.includes('src="/public/index.js"'));
        style = ctx.helper.assets.getStyle('index.css');
        assert(style.includes('href="/public/index.css"'));
      });

      it('should render without trailing /', () => {
        mock(app.config.assets, 'publicPath', '/public');

        let ctx = app.mockContext();
        ctx.helper.assets.setEntry('index.js');
        let script = ctx.helper.assets.getScript();
        assert(script.includes('__webpack_public_path__ = \'/public/\';'));
        assert(script.includes('src="/public/index.js"'));
        let style = ctx.helper.assets.getStyle();
        assert(style.includes('href="/public/index.css"'));

        ctx = app.mockContext();
        script = ctx.helper.assets.getScript('index.js');
        assert(script.includes('__webpack_public_path__ = \'/public/\';'));
        assert(script.includes('src="/public/index.js"'));
        style = ctx.helper.assets.getStyle('index.css');
        assert(style.includes('href="/public/index.css"'));
      });
    });
  });
});
