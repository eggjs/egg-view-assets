'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/context', controller.home.context);
  router.get('/options', controller.home.options);
  router.get('/cache', controller.home.cache);
  router.get('/renderString', controller.home.renderString);
};
