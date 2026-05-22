const data = require('../src/components/advancedMap/components/china-full.json')

console.log('=== 完整测试所有过滤场景 ===\n')

// 测试函数
function getCityLevelGeoJSON(geoJson, provinceAdcode) {
  const target = Number(provinceAdcode)
  return {
    type: 'FeatureCollection',
    features: geoJson.features.filter((f) => {
      const level = f.properties?.level
      const adcode = f.properties?.adcode
      const acroutes = f.properties?.acroutes || []

      if (!level || level === 'nation' || level === 'unknown') {
        return true
      }
      if (level === 'province' && adcode === target) {
        return true
      }
      if (level === 'city' && acroutes.includes(target)) {
        return true
      }
      return false
    })
  }
}

function getDistrictLevelGeoJSON(geoJson, cityAdcode) {
  const target = Number(cityAdcode)
  const isDirectMunicipality = String(target).endsWith('0000')

  return {
    type: 'FeatureCollection',
    features: geoJson.features.filter((f) => {
      const level = f.properties?.level
      const adcode = f.properties?.adcode
      const acroutes = f.properties?.acroutes || []
      const parentAdcode = f.properties?.parent?.adcode

      if (!level || level === 'nation' || level === 'unknown') {
        return true
      }

      if (isDirectMunicipality) {
        if (level === 'province' && adcode === target) {
          return true
        }
        if (level === 'district' && parentAdcode === target) {
          return true
        }
      } else {
        const provinceCode = Math.floor(target / 10000) * 10000

        if (level === 'province' && adcode === provinceCode) {
          return true
        }
        if (level === 'city' && adcode === target) {
          return true
        }
        if (
          level === 'district' &&
          (parentAdcode === target || acroutes.includes(target))
        ) {
          return true
        }
      }

      return false
    })
  }
}

// 测试1: 普通省份 - 广东省的市级数据
console.log('1️⃣ 测试普通省份：广东省 (440000) → 市级')
const gdCity = getCityLevelGeoJSON(data, '440000')
console.log(`   结果: ${gdCity.features.length} 个要素`)
console.log(
  `   城市数: ${
    gdCity.features.filter((f) => f.properties.level === 'city').length
  }`
)

// 测试2: 普通地级市 - 广州市的区县数据
console.log('\n2️⃣ 测试普通地级市：广州市 (440100) → 区县')
const gzDistrict = getDistrictLevelGeoJSON(data, '440100')
console.log(`   结果: ${gzDistrict.features.length} 个要素`)
console.log(
  `   区县数: ${
    gzDistrict.features.filter((f) => f.properties.level === 'district').length
  }`
)
console.log(
  '   区县:',
  gzDistrict.features
    .filter((f) => f.properties.level === 'district')
    .map((f) => f.properties.name)
    .join(', ')
)

// 测试3: 直辖市 - 北京市的区县数据
console.log('\n3️⃣ 测试直辖市：北京市 (110000) → 区县')
const bjDistrict = getDistrictLevelGeoJSON(data, '110000')
console.log(`   结果: ${bjDistrict.features.length} 个要素`)
console.log(
  `   区县数: ${
    bjDistrict.features.filter((f) => f.properties.level === 'district').length
  }`
)
console.log(
  '   区县:',
  bjDistrict.features
    .filter((f) => f.properties.level === 'district')
    .map((f) => f.properties.name)
    .join(', ')
)

// 测试4: 直辖市 - 上海市的区县数据
console.log('\n4️⃣ 测试直辖市：上海市 (310000) → 区县')
const shDistrict = getDistrictLevelGeoJSON(data, '310000')
console.log(`   结果: ${shDistrict.features.length} 个要素`)
console.log(
  `   区县数: ${
    shDistrict.features.filter((f) => f.properties.level === 'district').length
  }`
)

// 测试5: 浙江省 - 杭州市的区县数据
console.log('\n5️⃣ 测试普通地级市：杭州市 (330100) → 区县')
const hzDistrict = getDistrictLevelGeoJSON(data, '330100')
console.log(`   结果: ${hzDistrict.features.length} 个要素`)
console.log(
  `   区县数: ${
    hzDistrict.features.filter((f) => f.properties.level === 'district').length
  }`
)
console.log(
  '   区县:',
  hzDistrict.features
    .filter((f) => f.properties.level === 'district')
    .map((f) => f.properties.name)
    .join(', ')
)

console.log('\n✅ 所有测试完成！')
