'use strict';

const path = require('path');
const mock = require('egg-mock');
const fs = require('mz/fs');
const assert = require('assert');
const urllib = require('urllib');
const address = require('address');

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
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css" \/>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = 'http:\/\/127.0.0.1:8000\/';<\/script>/)
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
          .expect(200);
      });

      it('should GET jsx', () => {
        return app.httpRequest()
          .get('/account')
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/account.css" \/>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/account.js"><\/script>/)
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
          .expect(/<link rel="stylesheet" href="http:\/\/cdn.com\/app\/public\/index.b8e2efea.css" \/>/)
          .expect(/<script src="http:\/\/cdn.com\/app\/public\/index.c4ae6394.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = 'http:\/\/cdn.com\/app\/public\/';<\/script>/)
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
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
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css" \/>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%7D"));})()<\/script>'));
          })
          .expect(200);
      });

      it('should render context', () => {
        return app.httpRequest()
          .get('/context')
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
          .expect(200);
      });

      it('should use template from render options', () => {
        return app.httpRequest()
          .get('/options')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css" \/>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%7D"));})()<\/script>'));
          })
          .expect(200);
      });

      it('should use cache when template exist', async () => {
        const template = path.join(__dirname, 'fixtures/apps/assets-template/app/view/cache.html');
        await fs.writeFile(template, '{{ data }}');

        await app.httpRequest()
          .get('/cache')
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
          .expect(200);

        await fs.writeFile(template, 'override');

        await app.httpRequest()
          .get('/cache')
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
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
          .expect(/<link rel="stylesheet" href="http:\/\/cdn.com\/index.b8e2efea.css" \/>/)
          .expect(/<script src="http:\/\/cdn.com\/index.c4ae6394.js"><\/script>/)
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%7D"));})()<\/script>'));
          })
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
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css" \/>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = '\/';<\/script>/)
          .expect(/<script>window.resourceBaseUrl = 'http:\/\/127.0.0.1:8000\/';<\/script/)
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
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
          .expect(/<link rel="stylesheet" href="http:\/\/cdn.com\/app\/public\/index.b8e2efea.css" \/>/)
          .expect(/<script src="http:\/\/cdn.com\/app\/public\/index.c4ae6394.js"><\/script>/)
          .expect(/<script>window.__webpack_public_path__ = '\/app\/public\/';<\/script>/)
          .expect(/<script>window.resourceBaseUrl = 'http:\/\/cdn.com\/app\/public\/';<\/script/)
          .expect(res => {
            assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
          .expect(200);
      });
    });
  });

  describe('custom assets.url', () => {
    let app;

    before(() => {
      mock.env('prod');
      app = mock.cluster({
        baseDir: 'apps/custom-assets-url',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should GET /', () => {
      return app.httpRequest()
        .get('/')
        .expect(/<link rel="stylesheet" href="http:\/\/localhost\/index.b8e2efea.css" \/>/)
        .expect(200);
    });
  });

  describe('custom dev assets.url', () => {
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
        .expect(/<link rel="stylesheet" href="http:\/\/local.test.cn:8000\/index.css" \/>/)
        .expect(200);
    });
  });

  describe('https assets.url with dynamicLocalIP', () => {
    let app;

    before(() => {
      mock.env('local');
      app = mock.cluster({
        baseDir: 'apps/https',
        port: 8443,
        https: {
          cert: path.join(__dirname, 'fixtures/apps/https/server.cert'),
          key: path.join(__dirname, 'fixtures/apps/https/server.key'),
        },
      });
      return app.ready();
    });
    after(() => app.close());

    it('should GET /', () => {
      return urllib.request('https://127.0.0.1:8443', {
        dataType: 'text',
        rejectUnauthorized: false,
      }).then(response => {
        assert(response.status === 200);
        assert(response.data.includes('https://127.0.0.1:8000/index.css'));
      });
    });
  });

  describe('https assets.url without dynamicLocalIP', () => {
    let app;

    before(() => {
      mock.env('local');
      app = mock.cluster({
        baseDir: 'apps/https-dynamic-ip',
        port: 8443,
        https: {
          cert: path.join(__dirname, 'fixtures/apps/https-dynamic-ip/server.cert'),
          key: path.join(__dirname, 'fixtures/apps/https-dynamic-ip/server.key'),
        },
      });
      return app.ready();
    });
    after(() => app.close());

    it('should GET /', () => {
      return urllib.request(`https://${address.ip()}:8443`, {
        dataType: 'text',
        rejectUnauthorized: false,
      }).then(response => {
        assert(response.status === 200);
        assert(response.data.includes('http://127.0.0.1:8000/index.css'));
      });
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
        .expect(/window.__context__ =/)
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
        .expect(res => {
          assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22query%22%3A%22%3Cx%E2%80%A8x%3E%22%7D"));})()<\/script>'));
        })
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

      it('should render with publicPath setting /', () => {
        mock(app.config.assets, 'publicPath', '/');

        const ctx = app.mockContext();
        ctx.helper.assets.setEntry('index.js');
        const script = ctx.helper.assets.getScript();
        assert(script.includes('__webpack_public_path__ = \'/\';'));
        assert(script.includes('src="/index.js"'));
      });
    });
  });

  describe('manifest checking', () => {
    let app;
    afterEach(() => app.close());

    it('should check manifest.json on prod', async () => {
      mock.env('prod');
      app = mock.app({
        baseDir: 'apps/no-manifest',
      });
      // app.debug();
      try {
        await app.ready();
        throw new Error('should not run');
      } catch (err) {
        assert(err.message === path.join(__dirname, 'fixtures/apps/no-manifest/config/manifest.json') + ' is required');
      }
    });

    it('should not check manifest.json on local', async () => {
      mock.env('local');
      app = mock.app({
        baseDir: 'apps/no-manifest',
      });
      // app.debug();
      await app.ready();
    });

    it('should not check manifest.json on unittest', async () => {
      mock.env('unittest');
      app = mock.app({
        baseDir: 'apps/no-manifest',
      });
      // app.debug();
      await app.ready();
    });
  });

  describe('complex manifest', () => {
    let app;
    before(() => {
      mock.env('default');
      app = mock.app({
        baseDir: 'apps/complex-manifest',
      });
      return app.ready();
    });

    after(() => app.close());
    afterEach(mock.restore);

    it('should publicPath work', () => {
      const ctx = app.mockContext();
      ctx.helper.assets.setEntry('index.js');
      const script = ctx.helper.assets.getScript();
      assert(script.includes('__webpack_public_path__ = \'/public\/\';'));
      assert(script.includes('src="/public/index.js"'));
    });

    it('should contain host if setting assets.url', () => {
      mock(app.config.assets, 'url', 'http://remotehost');
      const ctx = app.mockContext();
      ctx.helper.assets.setEntry('index.js');
      const script = ctx.helper.assets.getScript();
      assert(script.includes('__webpack_public_path__ = \'/public\/\';'));
      assert(script.includes('src="http://remotehost/public/index.js"'));
      const style = ctx.helper.assets.getStyle();
      assert(style.includes('href="http://remotehost/index.css"'));
    });

    it('should assets.publicPath not work if resource path is a absolute url', () => {
      const ctx = app.mockContext();
      const style = ctx.helper.assets.getStyle('index.css');
      assert(style.includes('href="/index.css"'));
    });

    it('should assets.url not work if resource path is a complete url', () => {
      mock(app.config.assets, 'url', 'http://remotehost');
      const ctx = app.mockContext();
      const script = ctx.helper.assets.getScript('page1.js');
      assert(script.includes('src="http://cdn.com/page1.js"'));
    });
  });

  describe('support crossorigin', () => {
    let app;
    before(() => {
      mock.env('default');
      app = mock.app({
        baseDir: 'apps/crossorigin',
      });
      return app.ready();
    });

    after(() => app.close());
    afterEach(mock.restore);

    it('should works', () => {
      const ctx = app.mockContext();
      ctx.helper.assets.setEntry('index.js');
      const script = ctx.helper.assets.getScript();
      const style = ctx.helper.assets.getStyle();
      assert(style.includes('crossorigin'));
      assert(script.includes('crossorigin'));
    });
  });

  describe('should insert webpack global variable just once', () => {
    let app;
    before(() => {
      mock.env('default');
      app = mock.app({
        baseDir: 'apps/multiple-getscript',
      });
      return app.ready();
    });

    after(() => app.close());
    afterEach(mock.restore);

    it('should works', () => {
      const ctx = app.mockContext();

      const script = ctx.helper.assets.getScript('vendor.js');
      assert(script.includes('__webpack_public_path__ = \'/\';'));
      assert(script.includes('src="/vendor.js"'));

      [ 'a.js', 'b.js', 'c.js' ].forEach(file => {
        const anotherScript = ctx.helper.assets.getScript(file);
        assert(!anotherScript.includes('__webpack_public_path__'));
        assert(anotherScript.includes(`src="/${file}"`));
      });

    });
  });

  describe('AssetsView with nonce', () => {
    let app;

    describe('local', () => {
      before(() => {
        mock.env('local');
        app = mock.cluster({
          baseDir: 'apps/assets-nonce',
        });
        app.debug();
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/index.css" \/>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/index.js"><\/script>/)
          .expect(/<script nonce=cspnonce>window.__webpack_public_path__ = '\/';<\/script>/)
          .expect(res => {
            assert(res.text.includes('<script nonce=cspnonce>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
          .expect(200);
      });

      it('should GET jsx', () => {
        return app.httpRequest()
          .get('/account')
          .expect(/<link rel="stylesheet" href="http:\/\/127.0.0.1:8000\/account.css" \/>/)
          .expect(/<script src="http:\/\/127.0.0.1:8000\/account.js"><\/script>/)
          .expect(200);
      });
    });

    describe('production', () => {
      let app;

      before(() => {
        mock.env('prod');
        app = mock.cluster({
          baseDir: 'apps/assets-nonce',
        });
        return app.ready();
      });
      after(() => app.close());

      it('should GET /', () => {
        return app.httpRequest()
          .get('/')
          .expect(/<div id="root"><\/div>/)
          .expect(/<link rel="stylesheet" href="http:\/\/cdn.com\/app\/public\/index.b8e2efea.css" \/>/)
          .expect(/<script src="http:\/\/cdn.com\/app\/public\/index.c4ae6394.js"><\/script>/)
          .expect(/<script nonce=cspnonce>window.__webpack_public_path__ = '\/app\/public\/';<\/script>/)
          .expect(res => {
            assert(res.text.includes('<script nonce=cspnonce>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
          })
          .expect(200);
      });
    });
  });
});
