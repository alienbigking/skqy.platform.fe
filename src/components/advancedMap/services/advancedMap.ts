import { http } from '@/utils'
import { env } from '@/config/env'

export default {
  getUserRegion() {
    return http(`${env.HOST_API_URL}yxpt/sys/statistics/user-region`).then(
      (response) => {
        return response
      }
    )
  },
  getLocalChinaFullMap() {
    return import('@/assets/json/china-full.json').then((module: any) => {
      return module.default
    })
  },
  getChinaMap() {
    return http(
      `${env.HOST_ALIYUN_GEO_API_URL}areas_v3/bound/100000.json`
    ).then((response) => {
      return response
    })
  },
  /**
   * 获取在线中国地图 geoJSON（全国省份）
   */
  getChinaProvinceMap() {
    return http(
      `${env.HOST_ALIYUN_GEO_API_URL}areas_v3/bound/100000_full.json`
    ).then((response) => {
      return response
    })
  },
  getChinaCityMap() {
    return http(
      `${env.HOST_ALIYUN_GEO_API_URL}areas_v3/bound/100000_full_city.json`
    ).then((response) => {
      return response
    })
  },

  /**
   * 获取某个省的 geoJSON
   * 例如：330000（浙江省）
   */
  getProvinceByCodeMap(code: string | number) {
    return http(
      `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`
    ).then((response) => {
      return response
    })
  },
  getCityByCodeMap(code: string | number) {
    return http(
      `${env.HOST_ALIYUN_GEO_API_URL}areas_v3/bound/${code}_full_city.json`
    ).then((response) => {
      return response
    })
  },
  /**
   * 获取简版地图（数据更轻）
   */
  getSimpleChinaMap() {
    return http('https://geo.datav.aliyun.com/areas_v3/bound/100000.json').then(
      (response) => {
        return response
      }
    )
  }
}
