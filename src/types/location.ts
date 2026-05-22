/**
 * 位置信息相关类型定义
 */

// 坐标信息接口
export interface Coordinates {
  longitude: number // 经度
  latitude: number // 纬度
}

// 用户位置信息接口（注册时保存）
export interface UserLocationInfo {
  // 省份信息
  province: string // 省份名称，如："广东省"
  provinceAdcode: string // 省级行政区划代码，如："440000"

  // 城市信息
  city: string // 城市名称，如："广州市"
  cityAdcode: string // 市级行政区划代码，如："440100"
  cityCenter: Coordinates | null // 城市中心坐标（用于地图展示）

  // 区县信息
  district: string // 区县名称，如："天河区"
  districtAdcode: string // 区县级行政区划代码，如："440106"
  districtCenter: Coordinates | null // 区县中心坐标（用于地图展示）

  // 详细地址
  address: string // 完整地址，如："广东省广州市天河区天河路123号"

  // 用户实际位置（注册时的真实位置，精确到具体地点）
  userLocation: {
    longitude: number // 用户实际经度
    latitude: number // 用户实际纬度
    coordinateSystem: 'gcj02' | 'wgs84' | 'bd09' // 坐标系统
  }

  // 注册来源
  registerSource: 'web' | 'miniprogram' | 'app' | 'h5'
}

// 用户注册数据接口
export interface UserRegistrationData {
  // 用户基本信息
  username: string
  phone: string
  email?: string
  password?: string

  // 位置信息
  location: UserLocationInfo

  // 注册时间
  registerTime: string // ISO 8601 格式

  // 设备信息（可选）
  deviceInfo?: string
}

/**
 * 三种经纬度的区别说明：
 *
 * 1. userLocation (用户实际位置)
 *    - 用户注册时的真实GPS位置
 *    - 精确到具体地点（如：某个商场、某条街道）
 *    - 用途：精确统计、用户画像分析
 *    - 示例：[113.361663, 23.124943] (广州市天河区某个具体位置)
 *
 * 2. districtCenter (区县中心)
 *    - 区县的行政中心坐标
 *    - 通常是区政府所在地
 *    - 用途：地图上显示区县级散点图
 *    - 示例：[113.361663, 23.124943] (天河区中心)
 *
 * 3. cityCenter (城市中心)
 *    - 城市的行政中心坐标
 *    - 通常是市政府所在地
 *    - 用途：地图上显示城市级散点图
 *    - 示例：[113.264385, 23.129112] (广州市中心)
 */

// 地图展示用的城市数据接口
export interface MapCityData {
  name: string // 城市/区县名称
  value: number // 注册人数
  adcode: string // 行政区划代码
  center: Coordinates // 中心坐标（用于地图散点图展示）
}

// 地图展示用的省份数据接口
export interface MapProvinceData {
  name: string // 省份名称
  value: number // 总注册人数
  adcode: string // 省级行政区划代码
  center?: Coordinates // 省中心坐标（可选）
  cities: MapCityData[] // 城市列表
}
