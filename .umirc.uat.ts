export default {
  define: {
    'process.env': {
      UMI_ENV: 'uat',
      HOST_ALIYUN_GEO_API_URL: 'https://geo.datav.aliyun.com/',
      HOST_TIANDITU_API_URL: 'https://api.tianditu.gov.cn', // 天地图API
      HOST_TIANDITU_API_KEY: '58dd1d06974df7ca5b5c2f1e52e8a609', // 天地图API Key
      HOST_STATIC_RESOURCE_URL: 'https://platform.deepseaspace.com/', // 静态资源部署地址
      HOST_ANALYSIS_SERVICE_API_URL: '', // 分析服务API
      HOST_API_URL: 'https://api.deepseaspace.com/', // 业务API
      WSS_URL: 'wss://api.deepseaspace.com/'
    }
  }
}
