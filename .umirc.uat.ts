export default {
  define: {
    'process.env': {
      UMI_ENV: 'uat',
      HOST_ALIYUN_GEO_API_URL: 'https://geo.datav.aliyun.com/',
      HOST_TIANDITU_API_URL: 'https://api.tianditu.gov.cn', // 天地图API
      HOST_TIANDITU_API_KEY: '58dd1d06974df7ca5b5c2f1e52e8a609', // 天地图API Key
      HOST_STATIC_RESOURCE_URL: 'https://yxpt.innomedi.cn/platform/', // 服务器静态资源部署地址
      HOST_ANALYSIS_SERVICE_API_URL:
        'https://wx.innomedi.cn:18101/instant/V0.2/', //分析服务API
      HOST_API_URL: 'https://v1.innomedi.cn/', // 业务API
      WSS_URL: 'wss://ws-test.innomedi.cn/ws/'
    }
  }
}
