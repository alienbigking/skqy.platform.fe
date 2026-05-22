//第一个版本 使用动画帧及时间戳来控制渲染的点

// let dataBuffer = new Float32Array() // 使用类型化数组
// const dotNumber = 25
// let lastRenderTime = 0
//
// self.addEventListener('message', (event) => {
//   const { ecgData } = event.data
//
//   // 将新数据添加到数据缓冲区
//   const newDataBuffer = new Float32Array(dataBuffer.length + ecgData.length)
//   newDataBuffer.set(dataBuffer)
//   newDataBuffer.set(ecgData, dataBuffer.length)
//   dataBuffer = newDataBuffer
//
//   // 如果动画帧未启动，则启动动画帧
//   if (!lastRenderTime) {
//     startEcgWaveformAnimation()
//   }
// })
//
// const startEcgWaveformAnimation = () => {
//   const animate = (timestamp: number) => {
//     // 控制在指定的时间间隔内渲染数据点
//     if (timestamp - lastRenderTime > 200) {
//       if (dataBuffer.length > dotNumber) {
//         // 直接在原始数据上操作，避免复制
//         dataBuffer = dataBuffer.subarray(dotNumber)
//
//         // 发送消息给主线程，通知主线程新的ECG数据
//         const ecgDataArray = Array.from(dataBuffer) // 将 TypedArray 转换为普通数组
//         self.postMessage({ action: 'newEcgData', ecgData: ecgDataArray })
//       } else {
//         // 当前所有的数据已经处理完成后，通知主线程
//         self.postMessage({ action: 'longTimeNotReceivedData' })
//         return
//       }
//       lastRenderTime = timestamp
//     }
//     // 递归调用，以便在下一次动画帧更新时执行
//     requestAnimationFrame(animate)
//   }
//
//   // 启动动画帧
//   requestAnimationFrame(animate)
// }

// 【方案2】 每次只返回5s的数据点

let dataBuffer: any[] = [] // 用于缓存数据的数组
let ecgWaveformTimer: any = null
const sampleRate = 125 // 每秒125个数据点
const duration = 5 // 5秒钟的片段
const dataPerSegment = sampleRate * duration // 每个片段的数据量
const pointsPerInterval = 25 // 每200ms消耗的数据点数
const intervalDuration = 200 // 间隔时间

self.addEventListener('message', (event) => {
  const { ecgData } = event.data

  // console.log('多线程收到的数据源', ecgData)
  // 收到新数据，将其存储到数据缓冲区
  dataBuffer.push(...ecgData)

  // console.log('缓存数组长度', dataBuffer.length)
  // 如果定时器未启动，则启动定时器
  if (!ecgWaveformTimer) {
    startEcgWaveformTimer()
  }
})

const startEcgWaveformTimer = () => {
  ecgWaveformTimer = setInterval(() => {
    if (dataBuffer.length >= dataPerSegment) {
      // 从缓冲区中取出5秒钟的片段数据
      const segmentData = dataBuffer.slice(0, dataPerSegment)

      // 删除前面25个数据点
      dataBuffer = dataBuffer.slice(pointsPerInterval)

      // 发送消息给主线程，通知主线程新的 ECG 数据
      self.postMessage({ action: 'newEcgData', ecgData: segmentData })
    }

    if (dataBuffer.length === 0) {
      // 当前所有的数据已经处理完成后，通知主线程
      self.postMessage({ action: 'longTimeNotReceivedData' })
      clearInterval(ecgWaveformTimer)
      ecgWaveformTimer = null
    }
  }, intervalDuration)
}
