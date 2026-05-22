// 假设你的数据格式中的时间是可以被Date解析的字符串（例如ISO 8601格式）

self.addEventListener('message', (event) => {
  const { data, xData } = event.data
  console.log('接收的数据', data, xData)
  avgHeartRate(data, xData)
})

const avgHeartRate = (data: any[], xData: any[]) => {
  // 遍历数据，匹配时间填充心率数据
  xData.forEach((item, index: number) => {
    // 将字符串转换为Date对象
    const xTime = new Date(item.time)
    // console.log('数据转为时间戳', startTime.getTime())

    const value = data.find((d) => {
      const startTime = new Date(d.startTime)
      return xTime.getTime() === startTime.getTime()
    })

    if (value) {
      // console.log('坐标值', index)
      item.value = value.avgHr
    }
  })

  const result = xData.map((d) => d.value)
  // console.log('返回的内容', result)

  // 发送消息给主线程，通知主线程新的ECG数据
  self.postMessage({ action: 'newData', avgHeartRateData: result })
}

// const formatDate = (date:any) => {
//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0')
//   const day = String(date.getDate()).padStart(2, '0')
//   const hours = String(date.getHours()).padStart(2, '0')
//   const minutes = String(date.getMinutes()).padStart(2, '0')
//   const seconds = String(date.getSeconds()).padStart(2, '0')
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
// }
