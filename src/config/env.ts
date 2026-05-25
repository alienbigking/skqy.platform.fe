// @ts-nocheck
import production from '../../.umirc.production.ts'
import stage from '../../.umirc.stage.ts'
import develop from '../../.umirc.develop.ts'
import localDeploy from '../../.umirc.local-deploy.ts'

interface IEnv {
  HOST_ALIYUN_GEO_API_URL: string
  HOST_TIANDITU_API_URL: string
  HOST_TIANDITU_API_KEY: string
  HOST_STATIC_RESOURCE_URL: string
  HOST_ANALYSIS_SERVICE_API_URL: string
  HOST_API_URL: string
  OAUTH_CLIENT_ID: string
  OAUTH_CLIENT_SECRET: string
  GUACAMOLE_URL: string
  WSS_URL: string
  UMI_ENV: string
}

// 环境配置映射表
const configMap = {
  production,
  stage,
  develop,
  localDeploy
}

// 从配置文件中读取
const extractEnv = (cfg: any): IEnv => {
  const env = cfg?.define?.['process.env'] || {}
  return {
    UMI_ENV: env.UMI_ENV || '',
    HOST_ALIYUN_GEO_API_URL: env.HOST_ALIYUN_GEO_API_URL || '',
    HOST_TIANDITU_API_URL: env.HOST_TIANDITU_API_URL || '',
    HOST_TIANDITU_API_KEY: env.HOST_TIANDITU_API_KEY || '',
    HOST_STATIC_RESOURCE_URL: env.HOST_STATIC_RESOURCE_URL || '',
    HOST_ANALYSIS_SERVICE_API_URL: env.HOST_ANALYSIS_SERVICE_API_URL || '',
    HOST_API_URL: env.HOST_API_URL || '',
    OAUTH_CLIENT_ID: env.OAUTH_CLIENT_ID || '',
    OAUTH_CLIENT_SECRET: env.OAUTH_CLIENT_SECRET || '',
    GUACAMOLE_URL: env.GUACAMOLE_URL || '',
    WSS_URL: env.WSS_URL || ''
  }
}

const buildEnv = (): IEnv => {
  // if (process.env.NODE_ENV === 'development') {
  //   // 直接从 process.env 取
  //   console.log('[开发环境] 从 process.env ', process.env)
  //   return {
  //     UMI_ENV: process.env.UMI_ENV || 'development',
  //     HOST_STATIC_RESOURCE_URL: process.env.HOST_STATIC_RESOURCE_URL || '',
  //     HOST_ANALYSIS_SERVICE_API_URL:
  //       process.env.HOST_ANALYSIS_SERVICE_API_URL || '',
  //     HOST_API_URL: process.env.HOST_API_URL || '',
  //     GUACAMOLE_URL: process.env.GUACAMOLE_URL || '',
  //     WSS_URL: process.env.WSS_URL || ''
  //   }
  // }

  // 非开发环境：打包
  const umiEnv = process.env.UMI_ENV as keyof typeof configMap
  const cfg = configMap[umiEnv] || production

  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `[构建环境] NODE_ENV=${process.env.NODE_ENV}, UMI_ENV=${umiEnv}`
    )
  }

  return extractEnv(cfg)
}

const env: IEnv = buildEnv()
export { env }
