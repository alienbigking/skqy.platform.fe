import qs from 'qs'
/*
 * 获取浏览器URL参数
 * */

const getUrlParams = (customUrl?: string): any => {
  // 如果 customUrl 未传入，则使用当前页面 URL
  const targetUrl = customUrl || window.location.href

  // 使用 URL 对象解析目标 URL
  const parsedUrl = new URL(targetUrl)
  let url = parsedUrl.search // 获取 ? 后的查询参数
  let hash = parsedUrl.hash // 获取 # 后的哈希参数

  // 如果哈希部分包含查询参数
  if (hash.includes('?')) {
    const hashQueryString = hash.split('?')[1]
    url = url ? `${url}&${hashQueryString}` : hashQueryString // 合并参数
  }

  url = url.replace(/^\?/g, '') // 移除开头的 ?
  return qs.parse(url) // 使用 qs 解析为对象
}
export { getUrlParams }
