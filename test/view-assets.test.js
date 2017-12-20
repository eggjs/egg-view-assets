'use strict';

const mock = require('egg-mock');

describe('test/view-assets.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/view-assets-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, viewAssets')
      .expect(200);
  });
});
