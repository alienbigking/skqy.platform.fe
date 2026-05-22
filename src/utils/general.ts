import DayJS from 'dayjs'

type ClientInfo = {
  category: 'Browser' | 'App' | 'Service' | 'Monitor' | 'Unknown'
  name: string
  version?: string
}

// 性别
const gender = (value: number) => {
  console.log('性别判断', value)
  return value === 0 ? '未知' : value === 1 ? '男' : '女'
}
// 中文显示时间
const chineseTime = (value: string) => {
  // console.log('接收的日期', DayJS(value).unix())
  let d = new Date(DayJS(value).unix() * 1000)
  let date =
    d.getFullYear() +
    '年' +
    (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
    '月' +
    (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
    '日 ' +
    (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
    '时' +
    (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
    '分' +
    (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()) +
    '秒'
  return date
}
/*
 * 佩戴时长
 * @params
 * 时长 按天
 * */
const wearTime = (value: string) => {
  // console.log('接受的时长', value)
  let hours = Number(value) * 24 // 转为小时
  let wearTimeStr = value + '天'
  if (hours <= 120) {
    wearTimeStr = hours.toFixed(2) + '小时'
  }
  return wearTimeStr
}

/*
 * 时长取整
 * */
const timeCeil = (time: string) => {
  return Math.ceil(Number(time) * 24)
}

/*
 * 判断是否空对象
 * */
const isNullObject = (obj: object) => {
  return JSON.stringify(obj) === '{}'
}

const dataURLToBlob = (dataUrl: any) => {
  const arr = dataUrl.split(','),
    mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

// 根据日期算出年龄
const calculateAge = (birthday: string) => {
  const today = DayJS()
  return today.diff(DayJS(birthday), 'year')
}

const formatNumberWithCommas = (number: number | bigint) => {
  return new Intl.NumberFormat().format(number)
}

const generateRandomHashString = async () => {
  // 1. 生成一个随机 Uint8 数组，作为输入种子
  const randomArray = crypto.getRandomValues(new Uint8Array(16))

  // 2. 计算 SHA-256 哈希
  const buffer = await crypto.subtle.digest('SHA-256', randomArray)

  // 3. 将哈希结果转换为十六进制字符串
  const hashHex = Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  // 4. 过滤出字母和数字，并截取32位
  const alphanumeric = hashHex.replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)

  console.log('32位哈希值', alphanumeric)
  return alphanumeric
}
const formatPrice = (number: number | bigint): string => {
  // 将价格除以100以符合常见的价格格式（例如3000 -> 30）
  const formattedNumber = (Number(number) / 100).toFixed(2)

  // 使用 Intl.NumberFormat 格式化为带千分位的格式
  return new Intl.NumberFormat().format(Number(formattedNumber))
}

// 阿里云文件URL解析
const parseUrlToFileInfo = (
  url: string
): {
  name: string
  [key: string]: any // 允许动态添加属性
} | null => {
  const regex = /([^/]+)\.([a-zA-Z0-9]+)$/
  const match = url.match(regex)

  if (match) {
    const originalName = match[0] // 完整的文件名，包括扩展名

    return {
      url: url,
      name: originalName
    }
  }

  return null
}

// 去除http链接中?之后的参数
const removeQueryParams = (url: string): string => {
  // console.log('接收的URL', url)
  return url.replace(/\?.*$/, '') // 去掉 ? 后面的部分
}
const browserType = (ua: string) => {
  const matchMap = [
    { name: 'Edge', reg: /Edg\/([\d.]+)/ },
    { name: 'Chrome', reg: /Chrome\/([\d.]+)/ },
    { name: 'Firefox', reg: /Firefox\/([\d.]+)/ },
    { name: 'Safari', reg: /Version\/([\d.]+).*Safari/ }
  ]

  for (const item of matchMap) {
    const match = ua.match(item.reg)
    if (match) {
      return {
        name: item.name,
        version: match[1]
      }
    }
  }
  return {
    name: 'Unknown',
    version: ''
  }
}

const parseClient = (ua: string): ClientInfo => {
  const uaLower = ua.toLowerCase()

  /** 0️⃣ 监控系统（优先级最高） */
  const monitorMatchMap = [
    { name: 'Blackbox Exporter', reg: /blackbox exporter\/([\d.]+)/i },
    { name: 'Prometheus', reg: /prometheus\/([\d.]+)/i },
    { name: 'Grafana', reg: /grafana\/([\d.]+)/i }
  ]

  for (const item of monitorMatchMap) {
    const match = ua.match(item.reg)
    if (match) {
      return {
        category: 'Monitor',
        name: item.name,
        version: match[1]
      }
    }
  }

  /** 1️⃣ 服务端 / 程序请求 */
  const serviceMatchMap = [
    { name: 'Python requests', reg: /python-requests\/([\d.]+)/i },
    { name: 'Java OkHttp', reg: /okhttp\/([\d.]+)/i },
    { name: 'Node.js', reg: /node|axios/i },
    { name: 'curl', reg: /curl\/([\d.]+)/i },
    { name: 'Postman', reg: /postmanruntime\/([\d.]+)/i }
  ]

  for (const item of serviceMatchMap) {
    const match = ua.match(item.reg)
    if (match) {
      return {
        category: 'Service',
        name: item.name,
        version: match?.[1]
      }
    }
  }

  /** 2️⃣ 浏览器 */
  const browserMatchMap = [
    { name: 'Edge', reg: /Edg\/([\d.]+)/ },
    { name: 'Chrome', reg: /Chrome\/([\d.]+)/ },
    { name: 'Firefox', reg: /Firefox\/([\d.]+)/ },
    { name: 'Safari', reg: /Version\/([\d.]+).*Safari/ }
  ]

  for (const item of browserMatchMap) {
    const match = ua.match(item.reg)
    if (match) {
      return {
        category: 'Browser',
        name: item.name,
        version: match[1]
      }
    }
  }

  /** 3️⃣ 兜底 */
  return {
    category: 'Unknown',
    name: 'Unknown'
  }
}
export {
  gender,
  chineseTime,
  wearTime,
  timeCeil,
  isNullObject,
  dataURLToBlob,
  calculateAge,
  formatNumberWithCommas,
  generateRandomHashString,
  formatPrice,
  parseUrlToFileInfo,
  removeQueryParams,
  browserType,
  parseClient
}
