export default {
  define: {
    'process.env': {
      UMI_ENV: 'production',
      HOST_ALIYUN_GEO_API_URL: 'https://geo.datav.aliyun.com/',
      HOST_TIANDITU_API_URL: 'https://api.tianditu.gov.cn', // 天地图API
      HOST_TIANDITU_API_KEY: '58dd1d06974df7ca5b5c2f1e52e8a609', // 天地图API Key
      HOST_STATIC_RESOURCE_URL: 'https://platform.innomedi.cn', // 服务器静态资源部署地址
      // HOST_STATIC_RESOURCE_URL: 'http://localhost:8888', // 本地调试
      HOST_ANALYSIS_SERVICE_API_URL:
        'https://wx.innomedi.cn:18101/lxpjecgNext/', // 分析服务API
      // HOST_ANALYSIS_SERVICE_API_URL:
      //   'https://wx.innomedi.cn:18101/lxpjecgv2/', // 旧分析服务API v2版本
      HOST_API_URL: 'https://prod.innomedi.cn/', // 业务API
      // HOST_API_URL: '', // 本地调试走代理
      GUACAMOLE_URL: 'https://desktop.inno-medi.com:18090', // 工作台
      WSS_URL: 'wss://ws.innomedi.cn/ws/'
    }
  }
}
