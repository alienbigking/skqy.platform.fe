export default {
  define: {
    'process.env': {
      UMI_ENV: 'develop',
      HOST_ALIYUN_GEO_API_URL: '',
      HOST_TIANDITU_API_URL: '', // 天地图API
      HOST_TIANDITU_API_KEY: '58dd1d06974df7ca5b5c2f1e52e8a609', // 天地图API Key
      HOST_STATIC_RESOURCE_URL: 'http://localhost:8888', // 静态资源部署地址
      // HOST_ANALYSIS_SERVICE_API_URL: 'https://api.deepseaspace.com/instant/V0.2/', // 分析服务API
      HOST_ANALYSIS_SERVICE_API_URL: 'http://localhost:8080/', //分析服务API
      HOST_API_URL: 'http://localhost:3000/', // unbounded.social.be 本地开发后端
      GUACAMOLE_URL: '', // 工作台
      WSS_URL: 'wss://api.deepseaspace.com/',
      OAUTH_CLIENT_ID: 'webApp_prod_05ee',
      OAUTH_CLIENT_SECRET: 'a1123087c319e66afd0f787fbb50dbe3',
      // 生产 本地调试用
      // WSS_URL: 'wss://api.deepseaspace.com/'
    }
  }
}
