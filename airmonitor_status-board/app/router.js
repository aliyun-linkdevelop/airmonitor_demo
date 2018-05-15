'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // 提供给页面使用的获取数据 API
  router.get('/status-data', controller.home.statusData);
};
