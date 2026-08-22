export default {
  define: {
    'process.env': {
      UMI_ENV: 'stage',
      HOST_ALIYUN_GEO_API_URL: 'https://geo.datav.aliyun.com/',
      HOST_TIANDITU_API_URL: 'https://api.tianditu.gov.cn', // 天地图API
      HOST_TIANDITU_API_KEY: '58dd1d06974df7ca5b5c2f1e52e8a609', // 天地图API Key
      HOST_STATIC_RESOURCE_URL: 'https://platform.deepseaspace.com/', // 静态资源部署地址
      HOST_ANALYSIS_SERVICE_API_URL: '', // 分析系统
      HOST_API_URL: 'https://api.deepseaspace.com/', // 业务API
      GUACAMOLE_URL: '', // 分析工作台
      WSS_URL: 'wss://api.deepseaspace.com/',
      OAUTH_CLIENT_ID: 'webApp_prod_05ee',
      OAUTH_CLIENT_SECRET: 'a1123087c319e66afd0f787fbb50dbe3',
    }
  }
}
