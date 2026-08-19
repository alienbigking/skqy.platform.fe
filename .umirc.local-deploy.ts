export default {
  define: {
    'process.env': {
      UMI_ENV: 'localDeploy',
      HOST_ALIYUN_GEO_API_URL: 'https://geo.datav.aliyun.com/',
      HOST_TIANDITU_API_URL: 'https://api.tianditu.gov.cn', // 天地图API
      HOST_TIANDITU_API_KEY: '58dd1d06974df7ca5b5c2f1e52e8a609', // 天地图API Key
      HOST_STATIC_RESOURCE_URL: 'https://local-platform.innomedi.cn:8444/', // 服务器静态资源部署地址
      HOST_ANALYSIS_SERVICE_API_URL: 'https://local-analysis.innomedi.cn:8444/', //分析系统
      // HOST_ANALYSIS_SERVICE_API_URL: 'https://yxpt.innomedi.cn/lxpjecgv2/', //分析系统
      HOST_API_URL: 'http://localhost:3000/', //https://test.innomedi.cn/ http://127.0.0.1:8000/ 业务API
      GUACAMOLE_URL: 'https://desktop.inno-medi.com:18090', // 分析工作台
      WSS_URL: 'wss://local-ws.innomedi.cn:8444/ws/',
      OAUTH_CLIENT_ID: 'webApp_prod_05ee',
      OAUTH_CLIENT_SECRET: 'a1123087c319e66afd0f787fbb50dbe3',
    }
  }
}
