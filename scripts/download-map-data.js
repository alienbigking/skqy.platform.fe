const fs = require('fs')
const https = require('https')
const path = require('path')

// 所有省级行政区的 adcode
const provinces = [
  { name: '北京市', adcode: 110000 },
  { name: '天津市', adcode: 120000 },
  { name: '河北省', adcode: 130000 },
  { name: '山西省', adcode: 140000 },
  { name: '内蒙古自治区', adcode: 150000 },
  { name: '辽宁省', adcode: 210000 },
  { name: '吉林省', adcode: 220000 },
  { name: '黑龙江省', adcode: 230000 },
  { name: '上海市', adcode: 310000 },
  { name: '江苏省', adcode: 320000 },
  { name: '浙江省', adcode: 330000 },
  { name: '安徽省', adcode: 340000 },
  { name: '福建省', adcode: 350000 },
  { name: '江西省', adcode: 360000 },
  { name: '山东省', adcode: 370000 },
  { name: '河南省', adcode: 410000 },
  { name: '湖北省', adcode: 420000 },
  { name: '湖南省', adcode: 430000 },
  { name: '广东省', adcode: 440000 },
  { name: '广西壮族自治区', adcode: 450000 },
  { name: '海南省', adcode: 460000 },
  { name: '重庆市', adcode: 500000 },
  { name: '四川省', adcode: 510000 },
  { name: '贵州省', adcode: 520000 },
  { name: '云南省', adcode: 530000 },
  { name: '西藏自治区', adcode: 540000 },
  { name: '陕西省', adcode: 610000 },
  { name: '甘肃省', adcode: 620000 },
  { name: '青海省', adcode: 630000 },
  { name: '宁夏回族自治区', adcode: 640000 },
  { name: '新疆维吾尔自治区', adcode: 650000 },
  { name: '台湾省', adcode: 710000 },
  { name: '香港特别行政区', adcode: 810000 },
  { name: '澳门特别行政区', adcode: 820000 }
]

// 下载 JSON 数据
function downloadJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', reject)
  })
}

// 主函数
async function main() {
  console.log('开始下载地图数据...\n')

  const allFeatures = []

  // 1. 下载国家级数据（包含所有省的边界）
  console.log('1️⃣ 下载国家级数据...')
  try {
    const chinaData = await downloadJSON(
      'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
    )
    console.log(`   ✅ 国家级数据: ${chinaData.features.length} 个要素`)
    allFeatures.push(...chinaData.features)
  } catch (error) {
    console.error('   ❌ 下载国家级数据失败:', error.message)
  }

  // 2. 下载每个省的市级数据
  console.log('\n2️⃣ 下载省级市数据...')
  const skipProvinces = [710000, 810000, 820000] // 台湾、香港、澳门可能无详细数据

  for (const province of provinces) {
    try {
      const provinceData = await downloadJSON(
        `https://geo.datav.aliyun.com/areas_v3/bound/${province.adcode}_full.json`
      )
      console.log(
        `   ✅ ${province.name}: ${provinceData.features.length} 个要素`
      )
      allFeatures.push(...provinceData.features)

      // 延迟避免请求过快
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 200)
      })
    } catch (error) {
      if (skipProvinces.includes(province.adcode)) {
        console.log(`   ⚠️  ${province.name}: 暂无详细数据（已跳过）`)
      } else {
        console.error(`   ❌ ${province.name} 下载失败:`, error.message)
      }
    }
  }

  // 3. 下载每个省的区县级数据
  console.log('\n3️⃣ 下载省级区县数据...')
  const municipalities = [110000, 120000, 310000, 500000] // 直辖市（北京、天津、上海、重庆）

  for (const province of provinces) {
    // 直辖市的区县数据已经包含在 _full.json 中，无需单独下载
    if (municipalities.includes(province.adcode)) {
      console.log(`   ⏭️  ${province.name}: 直辖市，区县数据已包含在市级数据中`)
      continue
    }

    try {
      const districtData = await downloadJSON(
        `https://geo.datav.aliyun.com/areas_v3/bound/${province.adcode}_full_district.json`
      )
      console.log(
        `   ✅ ${province.name}: ${districtData.features.length} 个区县要素`
      )
      allFeatures.push(...districtData.features)

      // 延迟避免请求过快
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 200)
      })
    } catch (error) {
      if (skipProvinces.includes(province.adcode)) {
        console.log(`   ⚠️  ${province.name}: 暂无区县数据（已跳过）`)
      } else {
        console.error(`   ❌ ${province.name} 区县数据下载失败:`, error.message)
      }
    }
  }

  // 4. 去重（根据 adcode）
  console.log('\n4️⃣ 数据去重...')
  const uniqueFeatures = []
  const adcodeSet = new Set()

  for (const feature of allFeatures) {
    const adcode = feature.properties?.adcode
    if (adcode && !adcodeSet.has(adcode)) {
      adcodeSet.add(adcode)
      uniqueFeatures.push(feature)
    }
  }

  console.log(`   原始要素: ${allFeatures.length} 个`)
  console.log(`   去重后: ${uniqueFeatures.length} 个`)

  // 5. 统计各层级数量
  const levelCount = {}
  uniqueFeatures.forEach((f) => {
    const level = f.properties?.level || 'unknown'
    levelCount[level] = (levelCount[level] || 0) + 1
  })

  console.log('\n5️⃣ 层级统计:')
  Object.entries(levelCount).forEach(([level, count]) => {
    console.log(`   ${level}: ${count} 个`)
  })

  // 6. 保存文件
  const outputPath = path.join(
    __dirname,
    '../src/components/advancedMap/components/china-full.json'
  )
  const geoJSON = {
    type: 'FeatureCollection',
    features: uniqueFeatures
  }

  fs.writeFileSync(outputPath, JSON.stringify(geoJSON))
  console.log(`\n✅ 完整数据已保存到: ${outputPath}`)
  console.log(
    `   文件大小: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`
  )
}

main().catch(console.error)
