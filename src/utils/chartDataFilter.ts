// 过滤小于20的及数组长度为0的情况下默认为一组5个为0的数据
const filterHeartRateTrendData = (arr: number[]) => {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > 20) {
      newArr.push(arr[i])
    }
  }
  if (newArr.length === 0) {
    newArr = [0, 0, 0, 0, 0]
  }
  return newArr
}

//2个方法1：5个内取最大最小值 与 平均值 ,剔除0
const getMaxAndMinData = (arr: number[]) => {
  const max = Math.max.apply(null, arr)
  const min = Math.min.apply(null, arr)
  return [min, max]
}

// 中位数
const getMedian = (arr: number[]) => {
  arr.sort((x, y) => {
    return x - y
  })
  if (arr.length === 1) {
    return arr[0]
  } else if (arr.length % 2 === 0) {
    return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2
  } else {
    return arr[Math.floor(arr.length / 2)]
  }
}

export { filterHeartRateTrendData, getMaxAndMinData, getMedian }
