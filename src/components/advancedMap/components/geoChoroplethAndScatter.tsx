import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts'
import styles from './geoChoroplethAndScatter.less'
// import chinaFullJson from '@/assets/json/china-full.json'
import { advancedMapService } from '@/components/advancedMap/services'

interface Props {}

// 城市数据接口
interface CityData {
  name: string
  value: number
  adcode?: string // 城市/区县的行政区划代码
  longitude?: number // 经度（可选，用于散点图）
  latitude?: number // 纬度（可选，用于散点图）
}

// 省份数据接口
interface ProvinceData {
  name: string
  value: number
  adcode: string // 省级行政区划代码
  cities: CityData[]
}

let chart: echarts.ECharts | null = null
// 存储省份数据，用于点击时获取城市信息
let provinceDataMap: Map<string, ProvinceData> = new Map()
// 存储地图数据，供其他函数使用
let regionData: any[] = []
let scatterData: any[] = []
// 直辖市
const directMunicipalitys = ['110000', '120000', '310000', '500000']
// 台湾省
// const taiwanProvince = '710000'
// 特别行政区
const specialRegion = ['810000', '820000', '710000']

let chinaFullGeoJson: any | null = null
let chinaFullGeoJsonPromise: Promise<any> | null = null

const loadChinaFullGeoJson = async () => {
  if (chinaFullGeoJson) {
    return chinaFullGeoJson
  }

  if (!chinaFullGeoJsonPromise) {
    chinaFullGeoJsonPromise = advancedMapService
      .getLocalChinaFullMap()
      .then((data: any) => {
        chinaFullGeoJson = data
        return data
      })
  }

  return chinaFullGeoJsonPromise
}

const getChinaFullGeoJsonSync = () => {
  return chinaFullGeoJson
}

const GeoChoroplethAndScatter: React.FC<Props> = () => {
  const [allProvinceData, setAllProvinceData] = useState<ProvinceData[]>([])
  const [isMapRegistered, setIsMapRegistered] = useState(false)

  useEffect(() => {
    getUserRegion()

    initRegisterMap()
    return () => {
      chart?.dispose()
      chart = null
    }
  }, [])

  useEffect(() => {
    // if (allProvinceData.length) {
    console.log('allProvinceData:', allProvinceData)
    if (isMapRegistered) {
      initRenderMapData()
    }
    // }
  }, [allProvinceData, isMapRegistered])

  /** 初始化地图（全国） */
  const initRegisterMap = async () => {
    if (!chart) {
      chart = echarts.init(document.getElementById('container')!)
    }

    const fullGeo = await loadChinaFullGeoJson()
    const provinceGeo = getProvinceLevelGeoJSON(fullGeo)
    echarts.registerMap('china', provinceGeo as any)
    setIsMapRegistered(true)
  }

  const initRenderMapData = async () => {
    // 绘制地图
    renderChinaMap()
    bindProvinceClickEvent()
  }

  const getUserRegion = async () => {
    const { code, data } = await advancedMapService.getUserRegion()
    // console.log('获取所有的注册人数', data)
    setAllProvinceData(data?.provinces || [])
    // setAllProvinceData([])
  }
  // 初始化加载 获取省级：根据 adcode 判断（省级 adcode 后4位为0000）
  const getProvinceLevelGeoJSON = (geoJson: any) => {
    return {
      type: 'FeatureCollection',
      features: geoJson.features.filter((f: any) => {
        const adcode = f.properties?.adcode
        const level = f.properties?.level

        // 保留省级数据：level 为 province 或 adcode 后4位为0000（如 440000 广东省）
        if (level === 'province') return true

        if (
          adcode &&
          String(adcode).endsWith('0000') &&
          String(adcode).length === 6
        )
          return true

        return false
      })
    }
  }

  // 点击省或直辖市时加载市级或区县级数据
  const getCityLevelGeoJSON = (geoJson: any, provinceAdcode: string) => {
    const target = provinceAdcode
    const isAdvancedRegion =
      directMunicipalitys.includes(String(provinceAdcode)) ||
      specialRegion.includes(String(provinceAdcode))

    console.log('当前点击的省是否为直辖市', provinceAdcode, isAdvancedRegion)
    return {
      type: 'FeatureCollection',
      features: geoJson.features.filter((f: any) => {
        const level = f.properties?.level
        const adcode = f.properties?.adcode
        const acroutes = f.properties?.acroutes || []
        const parentAdcode = f.properties?.parent?.adcode

        // 国家边界（level 可能是 'nation' 或 'unknown'）
        if (!level || level === 'nation' || level === 'unknown') return true

        // 直辖市的情况：target 是省级 adcode (如 110000)
        if (isAdvancedRegion) {
          // 该省（直辖市本身）
          if (level === 'province' && adcode === target) return true

          // 该直辖市的所有区县（parentAdcode 是直辖市 adcode）
          if (level === 'district' && parentAdcode === target) return true
        } else {
          // 所有省
          if (level === 'province' && adcode === target) return true

          // 该省的所有市
          if (level === 'city' && acroutes.includes(target)) return true
        }

        return false
      })
    }
  }

  // 点击市时加载 获取区县：国家 + 省/市 + 区县
  const getDistrictLevelGeoJSON = (geoJson: any, cityAdcode: string) => {
    const target = Number(cityAdcode)
    const isDirectMunicipality = String(target).endsWith('0000') // 直辖市判断

    return {
      type: 'FeatureCollection',
      features: geoJson.features.filter((f: any) => {
        const level = f.properties?.level
        const adcode = f.properties?.adcode
        const acroutes = f.properties?.acroutes || []
        const parentAdcode = f.properties?.parent?.adcode

        // 国家边界（level 可能是 'nation'、'unknown' 或 undefined）
        if (!level || level === 'nation' || level === 'unknown') return true

        // 直辖市的情况：target 是省级 adcode (如 110000)
        if (isDirectMunicipality) {
          // 该省（直辖市本身）
          if (level === 'province' && adcode === target) return true

          // 该直辖市的所有区县（parent 是省级 adcode）
          if (level === 'district' && parentAdcode === target) return true
        } else {
          // 普通地级市的情况：target 是市级 adcode (如 440100)
          const provinceCode = Math.floor(target / 10000) * 10000

          // 上级省
          if (level === 'province' && adcode === provinceCode) return true

          // 该市
          if (level === 'city' && adcode === target) return true

          // 该市的所有区县
          if (
            level === 'district' &&
            (parentAdcode === target || acroutes.includes(target))
          )
            return true
        }

        return false
      })
    }
  }

  /** 绘制全国省级地图 */
  const renderChinaMap = () => {
    if (!chart) {
      return
    }

    // 省份数据（包含城市明细），后面会从业务接口获取
    // 注意：name 需要与地图 Geo JSON 中的名称一致（带"省"/"市"/"自治区"等后缀）

    const provinceData = allProvinceData
    console.log('业务数据', provinceData)
    // 存储省份数据到全局Map中，方便点击时获取
    provinceDataMap.clear()
    provinceData.forEach((p) => {
      provinceDataMap.set(p.name, p)
    })

    // 用于地图显示的简化数据（赋值给全局变量）
    regionData = provinceData.map((p) => ({
      name: p.name,
      value: p.value,
      cities: p.cities // 保留城市数据用于tooltip
    }))
    console.log('地图统计数据', regionData)
    // 城市散点数据（从 provinceData 中自动提取有经纬度的城市）
    scatterData = []
    provinceData.forEach((province) => {
      province.cities.forEach((city: any) => {
        // 只有同时具有经纬度的城市才添加到散点图
        if (city.longitude !== undefined && city.latitude !== undefined) {
          scatterData.push({
            name: city.name,
            value: [city.longitude, city.latitude, city.value],
            province: province.name,
            adcode: city.adcode
          })
        }
      })
    })
    console.log('城市散点数据', scatterData)

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          // 散点图（城市）
          if (params.seriesType === 'scatter') {
            return `<div style='padding: 5px;'>
              <strong>${params.name}</strong><br/>
              注册人数：<strong>${params.value[2]}</strong>
            </div>`
          }

          // 地图区域（省份）
          if (params.seriesType === 'map' && params.data) {
            const provinceName = params.name
            const totalValue = params.value || 0
            const cities = params.data.cities || []

            let cityListHtml = ''
            if (cities.length > 0) {
              cityListHtml =
                '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">'
              cityListHtml +=
                '<div style="color: #666; font-size: 12px; margin-bottom: 4px;">城市明细：</div>'
              cities.forEach((city: CityData) => {
                cityListHtml += `<div style='font-size: 12px; padding: 2px 0;'>
                  ${city.name}：<strong>${city.value ? city.value : 0}</strong>
                </div>`
              })
              cityListHtml += '</div>'
            }

            return `<div style='padding: 5px; min-width: 150px;'>
              <strong style='font-size: 14px;'>${provinceName}</strong><br/>
              <div style='margin-top: 5px;'>
                总注册人数：<strong style='color: #1890ff; font-size: 14px;'>${totalValue}</strong>
              </div>
              ${cityListHtml}
            </div>`
          }

          return `${params.name}<br/>注册人数：${params.value || 0}`
        }
      },
      geo: {
        map: 'china',
        roam: true,
        label: { show: true, fontSize: 10, color: '#333333' },
        zoom: 1.2,
        itemStyle: {
          borderColor: '#ccc',
          areaColor: 'transparent'
        },
        emphasis: {
          itemStyle: {
            // areaColor: 'transparent'  // 鼠标悬停时也透明
          }
        },
        select: {
          itemStyle: {
            areaColor: 'transparent' // 选中时也透明
          }
        }
      },
      series: [
        {
          name: '注册人数',
          type: 'map',
          map: 'china',
          geoIndex: 0,
          data: regionData
        },
        {
          name: '城市散点',
          type: 'scatter',
          coordinateSystem: 'geo',
          // symbolSize: (val: any) => Math.sqrt(val[2]) / 1.5,
          symbolSize: (val: any) => {
            const value = val[2] || 0
            const size = Math.sqrt(value) / 1.5
            return Math.max(size, 30) // 最小 6px
          },
          label: {
            show: true,
            formatter: (params: any) => params.value[2],
            position: 'top',
            color: '#22c55e',
            fontSize: 14,
            fontWeight: 'bold',
            textBorderColor: '#ffffff', // 白色描边
            textBorderWidth: 3
          },
          itemStyle: { color: '#d2e9ff' },
          data: scatterData
        }
      ]
    }

    chart.setOption(option)
  }

  /** 绑定点击省事件：点击后加载该省的市级地图 */
  const bindProvinceClickEvent = () => {
    if (!chart) {
      return
    }

    // 移除之前的点击事件，避免重复绑定
    chart.off('click')

    // 点击事件
    chart.on('click', (params: any) => {
      console.log('点击了省份或直辖市：', params)

      // 只处理地图区域的点击（不处理散点的点击）
      if (params.componentType === 'series' && params.seriesType === 'map') {
        handleProvinceClick(params)
      }
    })
  }

  /** 异步处理（可以 async）*/
  const handleProvinceClick = async (params: any) => {
    const provinceName = params.name

    const fullGeo = await loadChinaFullGeoJson()

    // 从地图数据中根据 name 查找对应的 adcode
    const provinceFeature = (fullGeo as any).features.find(
      (f: any) =>
        f.properties?.name === provinceName &&
        f.properties?.level === 'province'
    )
    const adcode = provinceFeature?.properties?.adcode
    console.log('当前省份信息', provinceFeature)

    if (!adcode) {
      console.warn(`未找到省份 "${provinceName}" 的 adcode`)
      return
    }

    console.log(`点击省份: ${provinceName}, adcode: ${adcode}`)

    // 使用本地数据过滤出市级地图
    const cityGeo = getCityLevelGeoJSON(fullGeo, adcode)
    console.log(
      '市级数据或直辖市数据详情:',
      cityGeo.features.map((f: any) => ({
        name: f.properties?.name,
        level: f.properties?.level,
        adcode: f.properties?.adcode
      }))
    )

    // 检查是否有市级数据或直辖市区数据（至少要有省边界 + 1个市）
    const cityCount = cityGeo.features.filter(
      (f: any) =>
        f.properties?.level === 'city' ||
        f.properties?.level === 'district' ||
        f.properties?.level === 'province'
    ).length

    if (cityCount === 0) {
      console.warn(`${provinceName} 暂无市级或直辖市区详细数据`)
      return
    }

    // 需要重新注册地图，直接在全国地图当前省地图上叠加市级边界
    renderCityMapOverlay(provinceFeature, provinceName, cityGeo, adcode)
  }

  /** 在全国地图叠加显示当前省份当前市级边界 */
  const renderCityMapOverlay = (
    provinceFeature: any,
    provinceName: string,
    cityGeo: any,
    provinceAdcode: number
  ) => {
    if (!chart) {
      return
    }

    const fullGeo = getChinaFullGeoJsonSync()
    if (!fullGeo) {
      return
    }

    // 提取市级边界数据
    const cityFeatures = cityGeo.features.filter(
      (f: any) =>
        f.properties?.level === 'city' || f.properties?.level === 'district'
    )

    console.log(`${provinceName} 的市级要素:`, cityFeatures.length)

    //  关键：重新注册 china 地图，包含省级或直辖市 + 市级边界或直辖市区边界
    const provinceGeo = getProvinceLevelGeoJSON(fullGeo)
    const newChinaGeo = {
      type: 'FeatureCollection',
      features: [
        ...provinceGeo.features, // 所有省级边界
        ...cityFeatures // 当前省的市级边界或直辖市区边界
      ]
    }
    console.log(
      '重新注册 china 地图，包含:',
      newChinaGeo.features.length,
      '个要素'
    )
    echarts.registerMap('china', newChinaGeo as any)

    const isAdvancedRegion =
      directMunicipalitys.includes(String(provinceAdcode)) ||
      specialRegion.includes(String(provinceAdcode))
    console.log('是否高级地区：', isAdvancedRegion)
    // 构建 regions 配置：省份边框 + 所有市级边界或直辖市区边界
    const geoRegions = [
      // 省份边框（不填充）
      {
        name: provinceName,
        itemStyle: {
          areaColor: 'transparent', // 透明，不填充
          borderColor: '#1890ff',
          borderWidth: 2
        },
        emphasis: {
          itemStyle: {
            areaColor: 'transparent' // 鼠标悬停时也透明
          }
        },
        label: {
          show: true,
          color: '#1890ff',
          fontWeight: 'bold'
        }
      },
      // 所有市级边界或直辖市区边界
      ...cityFeatures.map((f: any) => ({
        name: f.properties.name,
        itemStyle: {
          areaColor: 'transparent' // 透明，不填充
          // borderColor: '#1890ff',
          // borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: 'transparent' // 鼠标悬停时也透明
          }
        },
        label: {
          show: true,
          fontSize: 9
          // color: '#1890ff'
        }
      }))
    ]

    // 重新设置 option
    chart.setOption(
      {
        title: {
          text: `${provinceName} - 市级`,
          subtext: '双击返回全国',
          left: 'center',
          top: 20,
          textStyle: {
            fontSize: 16,
            fontWeight: 'bold'
          },
          subtextStyle: {
            fontSize: 12,
            color: '#666'
          }
        },
        geo: {
          map: 'china',
          roam: true,
          label: { show: true, fontSize: 10, color: '#333333' },
          zoom: isAdvancedRegion ? 20 : 2,
          center: provinceFeature.properties.center,
          itemStyle: {
            borderColor: '#ccc',
            areaColor: '#f9f9f9'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#e6f7ff' // 鼠标悬停时的填充颜色（浅蓝色）
            }
          },
          regions: geoRegions
        },
        series: [
          {
            name: '注册人数',
            type: 'map',
            map: 'china',
            geoIndex: 0,

            data: regionData // 保留省份数据
          },
          {
            name: '城市散点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: (val: any) => Math.sqrt(val[2]) / 1.5,
            itemStyle: { color: '#d2e9ff' },
            data: scatterData
          }
        ]
      },
      {
        notMerge: false,
        replaceMerge: ['series'], // ← 替换 series，清除选中状态
        silent: false
      }
    )

    // 绑定点击事件（处理省份切换和市点击）
    chart.off('click')
    chart.on('click', (params: any) => {
      console.log('点击了市地图：', params)

      if (params.componentType === 'series' && params.seriesType === 'map') {
        const clickedName = params.name

        // 判断点击的是省份还是市
        const isProvince = (fullGeo as any).features.find(
          (f: any) =>
            f.properties?.name === clickedName &&
            f.properties?.level === 'province'
        )

        const isCity = cityFeatures.find(
          (f: any) => f.properties?.name === clickedName
        )

        if (isCity) {
          // 点击的是市，显示区县
          handleCityClick(
            clickedName,
            provinceName,
            provinceAdcode,
            cityFeatures
          )
        } else if (isProvince) {
          // 点击的是其他省份，切换省份
          handleProvinceSwitch(clickedName)
        }
      }
    })

    // 绑定双击返回全国地图
    chart.off('dblclick')
    chart.on('dblclick', () => {
      console.log('双击返回全国地图')
      // initRegisterMap()
      initRenderMapData()
    })
  }

  /** 在省级地图上叠加显示区县级边界 */
  const renderDistrictMapOverlay = (
    cityFeature: any,
    cityName: string,
    provinceName: string,
    provinceAdcode: number,
    cityFeatures: any[],
    districtFeatures: any[]
  ) => {
    if (!chart) {
      return
    }

    const fullGeo = getChinaFullGeoJsonSync()
    if (!fullGeo) {
      return
    }

    console.log(`${cityName} 的区县要素:`, districtFeatures.length)

    // 🔥 关键：重新注册 china 地图，包含省级 + 市级 + 区县边界
    const provinceGeo = getProvinceLevelGeoJSON(fullGeo)
    const newChinaGeo = {
      type: 'FeatureCollection',
      features: [
        ...provinceGeo.features, // 所有省级边界
        ...cityFeatures, // 当前省的市级边界
        ...districtFeatures // 当前市的区县边界
      ]
    }
    echarts.registerMap('china', newChinaGeo as any)
    console.log(
      '重新注册 china 地图，包含:',
      newChinaGeo.features.length,
      '个要素'
    )

    // 构建 regions 配置：省份边框 + 市级边界 + 区县边界
    const regions = [
      // 省份边框（蓝色）
      {
        name: provinceName,
        itemStyle: {
          areaColor: 'transparent',
          borderColor: '#1890ff',
          borderWidth: 2
        },
        emphasis: {
          itemStyle: {
            areaColor: 'transparent' // 鼠标悬停时也透明
          }
        },
        label: {
          show: true,
          color: '#1890ff',
          fontWeight: 'bold'
        }
      },
      // 所有市级边界（绿色）
      ...cityFeatures.map((f: any) => ({
        name: f.properties.name,
        itemStyle: {
          areaColor: 'transparent'
          // borderColor: '#1890ff',
          // borderWidth: 1
        },
        emphasis: {
          itemStyle: {
            areaColor: 'transparent' // 鼠标悬停时也透明
          }
        },
        label: {
          show: true,
          fontSize: 9,
          color: '#1890ff'
        }
      })),
      // 当前市的区县边界（橙色）
      ...districtFeatures.map((f: any) => ({
        name: f.properties.name,
        itemStyle: {
          areaColor: 'transparent',
          borderColor: '#fa8c16', // 橙色边界
          borderWidth: 2
        },
        emphasis: {
          itemStyle: {
            areaColor: 'transparent' // 鼠标悬停时也透明
          }
        },
        label: {
          show: true,
          fontSize: 8,
          color: '#fa8c16'
        }
      }))
    ]

    // 获取原始散点数据
    const originalScatterData = scatterData

    // 更新配置
    chart.setOption({
      title: {
        text: `${provinceName} > ${cityName} - 区县`,
        subtext: '点击其他省切换 | 双击返回全国',
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        subtextStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      geo: {
        map: 'china',
        roam: true,
        label: { show: true, fontSize: 10, color: '#333333' },
        itemStyle: {
          borderColor: '#ccc'
          // areaColor: '#f9f9f9'
        },
        zoom: 5,
        center: cityFeature.properties.center,
        regions: regions
      },
      series: [
        {
          name: '注册人数',
          type: 'map',
          map: 'china',
          geoIndex: 0,
          data: regionData // 保留省份数据
        },
        {
          name: '城市散点',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbolSize: (val: any) => Math.sqrt(val[2]) / 1.5,
          itemStyle: { color: '#d2e9ff' },
          data: originalScatterData // 保留原始散点数据
        }
      ]
    })

    // 绑定点击事件（处理省份切换）
    chart.off('click')
    chart.on('click', (params: any) => {
      console.log('点击了区县地图：', params)

      if (params.componentType === 'series' && params.seriesType === 'map') {
        const clickedName = params.name

        // 判断点击的是否是省份
        const isProvince = (fullGeo as any).features.find(
          (f: any) =>
            f.properties?.name === clickedName &&
            f.properties?.level === 'province'
        )

        const isCity = cityFeatures.find(
          (f: any) => f.properties?.name === clickedName
        )

        if (isProvince) {
          // 点击的是其他省份，切换省份
          handleProvinceSwitch(clickedName)
        }

        if (isCity) {
          handleCityClick(
            clickedName,
            provinceName,
            provinceAdcode,
            cityFeatures
          )
        }
      }
    })

    // 绑定双击返回全国地图
    chart.off('dblclick')
    chart.on('dblclick', () => {
      console.log('双击返回全国地图')
      // initRegisterMap()
      initRenderMapData()
    })
  }

  /** 切换省份 */
  const handleProvinceSwitch = async (newProvinceName: string) => {
    const fullGeo = await loadChinaFullGeoJson()

    // 从地图数据中根据 name 查找对应的 adcode
    const provinceFeature = (fullGeo as any).features.find(
      (f: any) =>
        f.properties?.name === newProvinceName &&
        f.properties?.level === 'province'
    )
    const newAdcode = provinceFeature?.properties?.adcode

    if (!newAdcode) {
      console.warn(`未找到省份 "${newProvinceName}" 的 adcode`)
      return
    }

    console.log(`切换到省份: ${newProvinceName}, adcode: ${newAdcode}`)

    // 加载新省份的市级地图
    const cityGeo = getCityLevelGeoJSON(fullGeo, newAdcode)
    const cityCount = cityGeo.features.filter(
      (f: any) =>
        f.properties?.level === 'city' || f.properties?.level === 'district'
    ).length

    if (cityCount === 0) {
      console.warn(`${newProvinceName} 暂无市级或直辖市区详细数据`)
      return
    }

    renderCityMapOverlay(provinceFeature, newProvinceName, cityGeo, newAdcode)
  }

  /** 点击市，显示区县 */
  const handleCityClick = async (
    cityName: string,
    provinceName: string,
    provinceAdcode: number,
    cityFeatures: any[]
  ) => {
    const fullGeo = await loadChinaFullGeoJson()

    // 从地图数据中根据 name 查找对应的 adcode
    const cityFeature = (fullGeo as any).features.find(
      (f: any) =>
        f.properties?.name === cityName && f.properties?.level === 'city'
    )
    const adcode = cityFeature?.properties?.adcode

    if (!adcode) {
      console.warn(`未找到城市 "${cityName}" 的 adcode`)
      return
    }

    console.log(`正在加载 ${cityName} (adcode: ${adcode}) 的区县地图...`)

    // 使用本地数据过滤区县级数据
    const districtGeo = getDistrictLevelGeoJSON(fullGeo, adcode)
    const districtFeatures = districtGeo.features.filter(
      (f: any) => f.properties?.level === 'district'
    )

    console.log(`${cityName} 区县数据:`, districtFeatures.length, '个要素')

    // 绘制区县地图
    renderDistrictMapOverlay(
      cityFeature,
      cityName,
      provinceName,
      provinceAdcode,
      cityFeatures,
      districtFeatures
    )
  }

  return (
    <div
      id="container"
      className={styles.geoChoroplethAndScatter}
      style={{ width: '100%', height: '100%' }}
    ></div>
  )
}

export default GeoChoroplethAndScatter
