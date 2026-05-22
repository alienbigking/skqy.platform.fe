/**
 * 10进制 转 小端16进制
 * @param num 十进制数字
 * @returns 小端16进制字符串
 */
const decToHex = (num: number): string => {
  return (num + 2 ** 32).toString(16).match(/\B../g)!.reverse().join('')
}

/**
 * 小端十六进制 转 十进制
 * @param num 小端十六进制字符串
 * @returns 十进制数字
 */
const hexToDec = (num: string): number => {
  return Buffer.from(num, 'hex').readInt32LE()
}

/**
 * short转16进制
 * @param num short类型数字
 * @returns 16进制字符串
 */
const short2Hex = (num: number): string => {
  return (num + 2 ** 16).toString(16).match(/\B../g)!.reverse().join('')
}

/**
 * 16进制转成有符号short
 * @param hex 16进制字符串
 * @param isLittleEndian 是否是小端模式
 * @returns 有符号short类型数字
 */
const hex2Short = (
  hex: string,
  isLittleEndian: boolean = true
): number | undefined => {
  if (hex.length < 4) {
    console.log('hex string length error ', hex.length)
    return undefined
  }
  let text = hex
  if (isLittleEndian) {
    text = hex.substr(2, 2) + hex.substr(0, 2)
  }
  let two: any = parseInt(text, 16).toString(2)
  let bitNum = text.length * 4
  if (two.length < bitNum) {
    while (two.length < bitNum) {
      two = '0' + two
    }
  }

  if (two.substring(0, 1) === '0') {
    two = parseInt(two, 2)

    return two
  } else {
    let twoUnsign = ''
    two = parseInt(two, 2) - 1
    two = two.toString(2)
    twoUnsign = two.substring(1, bitNum)
    twoUnsign = twoUnsign.replace(/0/g, 'z')
    twoUnsign = twoUnsign.replace(/1/g, '0')
    twoUnsign = twoUnsign.replace(/z/g, '1')
    two = parseInt(String(-twoUnsign), 2)

    return two
  }
}

/**
 * 10进制转16进制
 * @param number 十进制数字
 * @returns 16进制字符串
 */
const decimal2Hex = (number: number): string => {
  return number < 16 ? '0' + number.toString(16) : number.toString(16)
}

/**
 * 16进制转10进制无符号整数
 * @param hex 16进制字符串
 * @returns 10进制无符号整数
 */
const hex2int = (hex: string): number => {
  let len = hex.length,
    a = new Array(len),
    code
  for (let i = 0; i < len; i++) {
    code = hex.charCodeAt(i)
    if (48 <= code && code < 58) {
      code -= 48
    } else {
      code = (code & 0xdf) - 65 + 10
    }
    a[i] = code
  }

  return a.reduce((acc, c) => {
    return 16 * acc + c
  }, 0)
}

/**
 * 将ArrayBuffer转换成16进制字符串
 * @param buffer ArrayBuffer对象
 * @returns 16进制字符串
 */
const ab2hex = (buffer: Iterable<number>): string => {
  const hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    (bit: number) => {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('')
}

/**
 * 将字符串转utf-8编码
 * @param text 字符串
 * @returns UTF-8编码的字节数组
 */
const encodeUtf8 = (text: string | number | boolean): number[] => {
  const code = encodeURIComponent(text)
  const bytes = []
  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i)
    if (c === '%') {
      const hex = code.charAt(i + 1) + code.charAt(i + 2)
      const hexVal = parseInt(hex, 16)
      bytes.push(hexVal)
      i += 2
    } else {
      bytes.push(c.charCodeAt(0))
    }
  }
  return bytes
}

/**
 * 解码utf-8编码字符串
 * @param bytes UTF-8编码的字节数组
 * @returns 解码后的字符串
 */
const decodeUtf8 = (bytes: string | any[]): string => {
  let encoded = ''
  for (let i = 0; i < bytes.length; i++) {
    encoded += '%' + bytes[i].toString(16)
  }
  return decodeURIComponent(encoded)
}

/**
 * 填充字节数组达到length的长度要求
 * @param text 字符串
 * @param length 长度
 * @returns 填充后的字节数组
 */
const fillBytes = (text: any, length: number): number[] => {
  let bytes = encodeUtf8(text)
  let appendSize = length - bytes.length
  for (let i = 0; i < appendSize; i++) {
    bytes.push(parseInt('00', 16))
  }
  return bytes
}

const base64ToBinary = (base64Value: string) => {
  // 假设base64String为你的base64编码字符串

  // 将base64字符串解码为二进制数据
  const binaryString = atob(base64Value)

  // 将二进制数据转换为16进制字符串
  let hexString = ''
  for (let i = 548; i < binaryString.length; i++) {
    // 0
    const hex = binaryString.charCodeAt(i).toString(16)
    hexString += (hex.length === 1 ? '0' : '') + hex
  }
  // console.log('转换为16进制的数据', hexString)

  return getBleData(hexString)
}

/*
 * 将16进制字符串转为可绘制波形数据
 * */
const getBleData = (bleData: string) => {
  let bleDataStr = bleData
  let bleDataArr = []

  // console.log('开始转换数据', bleDataStr)

  for (let i = 0; i < bleDataStr.length / 4; i++) {
    let subText = bleDataStr.substr(i * 4, 4) //16进制 4个字符 8字节大小
    let value = hex2Short(subText)

    // console.log('转换后的结果', value)
    bleDataArr.push(value)
  }

  // console.log('蓝牙数据', bleDataArr)

  return bleDataArr
}

export { base64ToBinary, hex2Short }
