'use strict';

const Service = require('egg').Service;
const Client = require('aliyun-api-gateway').Client;

class ApiClient extends Service {
  getClient() {
    if (!this.client) {
      // 使用配置中的 AppKey 以及 AppSecret 创建阿里云 API 网关 Client
      this.client = new Client(this.config.appKey, this.config.appSecret);
    }

    return this.client;
  }

  async post(apiPath, apiVer, params) {
    const client = this.getClient();

    let response = null;
    try {
      // LinkDevelop 平台的 URL 为 http://api.link.aliyun.com
      // 该地址可以在 LinkDevelop 平台的资源管理》官方服务中通过查看 API 详情得到
      const apiurl = 'https://api.link.aliyun.com' + apiPath;
      const payload = {
        data: {
          id: new Date() * 1 + '',
          version: '1.0',
          request: {
            apiVer: apiVer || '',
          },
          params,
        },
      };
      response = await client.post(apiurl, payload);

    } catch (error) {
      this.ctx.logger.error('API Response Error', error);
      response = error;
    }
    return response || {};
  }
}

module.exports = ApiClient;
