'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/account', controller.home.account);
  router.get('/renderString', controller.home.renderString);
};
