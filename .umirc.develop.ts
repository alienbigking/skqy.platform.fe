export default {
  define: {
    'process.env': {
      UMI_ENV: 'develop',
      HOST_ALIYUN_GEO_API_URL: '',
      // HOST_ALIYUN_GEO_API_URL: 'https://geo.datav.aliyun.com/',
      HOST_TIANDITU_API_URL: '', // 天地图API
      HOST_TIANDITU_API_KEY: '58dd1d06974df7ca5b5c2f1e52e8a609', // 天地图API Key
      HOST_STATIC_RESOURCE_URL: 'http://localhost:8888', // 服务器静态资源部署地址
      // HOST_ANALYSIS_SERVICE_API_URL: 'https://test.innomedi.cn/instant/V0.2/', //分析服务API
      HOST_ANALYSIS_SERVICE_API_URL: 'http://localhost:8080/', //分析服务API
      HOST_API_URL: 'http://localhost:3000/', // unbounded.social.be 本地开发后端
      OAUTH_CLIENT_ID: 'webApp_prod_05ee',
      OAUTH_CLIENT_SECRET: 'a1123087c319e66afd0f787fbb50dbe3',
      GUACAMOLE_URL: 'https://desktop.inno-medi.com:18090', // 工作台
      WSS_URL: 'wss://ws-test.innomedi.cn/ws/'

      // 生产 本地调试用
      // WSS_URL: 'wss://ws.innomedi.cn/ws/'
    }
  }
}
