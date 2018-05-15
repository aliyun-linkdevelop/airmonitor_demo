'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1517990340798_1979';

  // add your config here
  config.middleware = [];

  // 硬件产品 ProductKey，为设备接入中创建产品时得到的 ProductKey
  config.ProductKey = '__YOUR_DEVICE_PRODUCT_KEY__';

  // 非托管 Web 应用的 AppKey 及 AppSecret
  config.appKey = '__YOUR_WEB_APP_KEY__';
  config.appSecret = '__YOUR_WEB_APP_SECRET__';

  // 需要展示数据的设备名称列表，这里为在设备接入中添加的测试设备名称
  config.deviceNames = {
    'living-room': '__YOUR_DEVICE_NAME__',
    'bed-room': '__YOUR_DEVICE_NAME__',
    'guest-room': '__YOUR_DEVICE_NAME__',
  };

  // 配置模板引擎
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.html': 'nunjucks',
    },
  };

  return config;
};
