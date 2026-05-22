const data = require('../src/components/advancedMap/components/china-full.json')

console.log('=== 测试地图数据过滤 ===\n')

// 测试1: 广东省的市级数据
console.log('1️⃣ 测试广东省 (440000) 的市级数据过滤:')
const guangdongAdcode = 440000
const cityFeatures = data.features.filter((f) => {
  const level = f.properties?.level
  const adcode = f.properties?.adcode
  const acroutes = f.properties?.acroutes || []

  if (!level || level === 'nation' || level === 'unknown') {
    return true
  }
  if (level === 'province' && adcode === guangdongAdcode) {
    return true
  }
  if (level === 'city' && acroutes.includes(guangdongAdcode)) {
    return true
  }
  return false
})

console.log(`   过滤结果: ${cityFeatures.length} 个要素`)
console.log('   包含:')
cityFeatures.forEach((f) => {
  console.log(
    `     - ${f.properties.name} (${f.properties.level}, ${f.properties.adcode})`
  )
})

// 测试2: 广州市的区县数据
console.log('\n2️⃣ 测试广州市 (440100) 的区县数据过滤:')
const guangzhouAdcode = 440100
const districtFeatures = data.features.filter((f) => {
  const level = f.properties?.level
  const adcode = f.properties?.adcode
  const acroutes = f.properties?.acroutes || []
  const parentAdcode = f.properties?.parent?.adcode

  if (!level || level === 'nation' || level === 'unknown') {
    return true
  }
  if (level === 'province' && acroutes.includes(guangzhouAdcode)) {
    return true
  }
  if (level === 'city' && adcode === guangzhouAdcode) {
    return true
  }
  if (
    level === 'district' &&
    (acroutes.includes(guangzhouAdcode) || parentAdcode === guangzhouAdcode)
  ) {
    return true
  }
  return false
})

console.log(`   过滤结果: ${districtFeatures.length} 个要素`)
console.log('   包含:')
districtFeatures.forEach((f) => {
  console.log(
    `     - ${f.properties.name} (${f.properties.level}, ${f.properties.adcode})`
  )
})

// 测试3: 统计各层级数量
console.log('\n3️⃣ 数据层级统计:')
const levelCount = {}
data.features.forEach((f) => {
  const level = f.properties?.level || 'unknown'
  levelCount[level] = (levelCount[level] || 0) + 1
})
Object.entries(levelCount).forEach(([level, count]) => {
  console.log(`   ${level}: ${count} 个`)
})

// 测试4: 检查 acroutes 数据
console.log('\n4️⃣ 检查 acroutes 数据示例:')
const sampleCity = data.features.find((f) => f.properties.level === 'city')
const sampleDistrict = data.features.find(
  (f) => f.properties.level === 'district'
)
console.log('   市级示例:', {
  name: sampleCity?.properties.name,
  adcode: sampleCity?.properties.adcode,
  acroutes: sampleCity?.properties.acroutes,
  parent: sampleCity?.properties.parent
})
console.log('   区县示例:', {
  name: sampleDistrict?.properties.name,
  adcode: sampleDistrict?.properties.adcode,
  acroutes: sampleDistrict?.properties.acroutes,
  parent: sampleDistrict?.properties.parent
})
