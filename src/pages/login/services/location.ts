import { http } from '@/utils'
import { env } from '@/config/env'

export default {
  /**
   * 逆地理编码 - 根据坐标获取地址信息
   */
  reverseGeocode(longitude: number, latitude: number) {
    return http(
      `${env.HOST_TIANDITU_API_URL}/geocoder?postStr=${encodeURIComponent(
        JSON.stringify({
          lon: longitude,
          lat: latitude,
          ver: 1
        })
      )}&type=geocode&tk=${env.HOST_TIANDITU_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then((response) => {
      return response
    })
  },
  /**
   * 地理编码 - 根据地址关键词获取坐标
   */
  geocode(keyword: string) {
    return http(
      `${env.HOST_TIANDITU_API_URL}/geocoder?ds=${encodeURIComponent(
        JSON.stringify({ keyWord: keyword })
      )}&tk=${env.HOST_TIANDITU_API_KEY}`
    ).then((response) => {
      return response
    })
  }
}
