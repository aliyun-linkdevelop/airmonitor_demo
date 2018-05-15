'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.ctx.render('index.html', { });
  }

  async statusData() {
    // 获取配置中所有的设备列表
    const deviceNames = this.config.deviceNames;
    const statusData = {};
    const devicePositions = Object.keys(deviceNames);

    for (let i = 0; i < devicePositions.length; ++i) {
      const devicePosition = devicePositions[i];

      // 使用 /thing/device/properties/query 这个 API 来获取设备的所有属性列表
      const ret = await this.ctx.service.apiclient.post('/thing/device/properties/query', '1.1.0', {
        productKey: this.config.ProductKey,
        deviceName: deviceNames[devicePosition],
      });

      if (ret.code === 200) {
        // API 返回的属性列表为数组形式，这里转换为键值对
        const data = ret.data.reduce((props, item) => {
          props[item.attribute] = item.value;
          return props;
        }, {});
        statusData[devicePosition] = data;
      }
    }

    this.ctx.body = JSON.stringify(statusData);
    this.ctx.response.set('Content-Type', 'application/json');
  }
}

module.exports = HomeController;
