import { locationService } from '../services'
import { ILocationInfo } from '../types/login'

/**
 * 生成行政区划代码的辅助函数（备用方案）
 */
const generateAdcode = (name: string, level: string): string => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  if (level === 'province') {
    return String((hash % 90) + 10) + '0000'
  } else if (level === 'city') {
    return String((hash % 9000) + 1000) + '00'
  } else {
    return String((hash % 900000) + 100000)
  }
}

/**
 * 获取用户位置信息（包含业务逻辑处理）
 */
export const getLocation = (): Promise<ILocationInfo> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持定位'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { longitude, latitude } = position.coords
        console.log('获取到位置信息:', { longitude, latitude })
        try {
          // 调用天地图逆地理编码API
          const geoData = await locationService.reverseGeocode(
            longitude,
            latitude
          )

          if (geoData.status === '0' && geoData.result) {
            const result = geoData.result
            const addressComponent = result.addressComponent

            // 获取城市中心坐标
            const cityName = addressComponent.city || addressComponent.province
            const cityCenterData = await locationService.geocode(cityName)
            const cityCenter =
              cityCenterData.status === '0' && cityCenterData.location
                ? {
                    longitude: cityCenterData.location.lon,
                    latitude: cityCenterData.location.lat
                  }
                : null

            // 获取区县中心坐标
            const districtName =
              addressComponent.county || addressComponent.district
            const districtCenterData = await locationService.geocode(
              districtName
            )
            const districtCenter =
              districtCenterData.status === '0' && districtCenterData.location
                ? {
                    longitude: districtCenterData.location.lon,
                    latitude: districtCenterData.location.lat
                  }
                : null

            // 提取行政区划代码
            const provinceAdcode =
              addressComponent.provinceCode ||
              addressComponent.province_code ||
              ''
            const cityAdcode =
              addressComponent.cityCode || addressComponent.city_code || ''
            const districtAdcode =
              addressComponent.countyCode || addressComponent.county_code || ''

            resolve({
              // 省份信息
              province: addressComponent.province,
              provinceAdcode:
                provinceAdcode ||
                generateAdcode(addressComponent.province, 'province'),

              // 城市信息
              city: cityName,
              cityAdcode: cityAdcode || generateAdcode(cityName, 'city'),
              cityCenter: cityCenter,

              // 区县信息
              district: districtName,
              districtAdcode:
                districtAdcode || generateAdcode(districtName, 'district'),
              districtCenter: districtCenter,

              // 详细地址
              address: result.formatted_address || result.formattedAddress,

              // 用户实际位置坐标（注册时的真实位置）
              userLocation: {
                longitude: longitude,
                latitude: latitude,
                coordinateSystem: 'gcj02'
              },

              // 注册来源
              registerSource: 'web'
            })
          } else {
            reject(new Error('天地图API返回错误'))
          }
        } catch (error) {
          reject(error)
        }
      },
      (error) => {
        reject(error)
      }
    )
  })
}
