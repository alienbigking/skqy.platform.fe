import { http } from '@/utils'
import { env } from '@/config/env'
import { IRRPlotParams } from '../types/home'

export default {
  // 获取个人信息，里面部分字段将废弃,姓名、年龄字段从管理服务中获取
  // getProfile(id: string) {
  //   return http(
  //     `${env.HOST_ANALYSIS_SERVICE_API_URL}getProfile/Ysd2f35x/${id}`,
  //     {
  //       method: 'POST'
  //     }
  //   ).then((response) => {
  //     return response.msg
  //   })
  // }
}
