'use strict';

const mock = require('egg-mock');
const puppeteer = require('puppeteer');
const sleep = require('mz-modules/sleep');
const assert = require('assert');

describe('test/ui.test.js', () => {
  let app;
  before(() => {
    mock.env('default');
    app = mock.cluster({
      baseDir: 'apps/ui',
      port: 7001,
    });
    app.debug();
    return app.ready();
  });
  after(() => app.close());
  after(mock.restore);

  it('should request index.js', async () => {
    await app.httpRequest()
      .get('/public/index.js')
      .expect(/window.context.data/)
      .expect(200);
  });

  it('should render html', async () => {
    await app.httpRequest()
      .get('/')
      .expect(res => {
        assert(res.text.includes('<script>(function(){window.context = JSON.parse(decodeURIComponent("%7B%22data%22%3A1%7D"));})()<\/script>'));
      })
      .expect(200);
  });

  it('should console', async () => {
    const browser = await puppeteer.launch({
      args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
    });
    const page = await browser.newPage();
    let text = '';
    page.on('console', msg => (text += msg.text()));
    await page.goto('http://127.0.0.1:7001');

    await sleep(5000);
    assert(text === 'data: 1');
  });

});
