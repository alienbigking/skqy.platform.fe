import {
  AxiosResponse,
  request,
  RequestConfig,
  RequestError,
  RequestOptions
} from '@umijs/max'
import { storage } from '@/utils'
import { history } from '@@/core/history'
import { emitIdleActivity } from '@/utils/idleActivity'

let hasShownError = false

const requestConfig: RequestConfig = {
  timeout: 180000,
  method: 'GET',

  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {}
  },
  requestInterceptors: [
    // 一个二元组，第一个元素是 request 拦截器，第二个元素是错误处理
    [
      (url: string, options: RequestOptions) => {
        emitIdleActivity()
        return { url, options }
      },
      (error: RequestError) => {
        return Promise.reject(error)
      }
    ]
  ],
  responseInterceptors: [
    // 一个二元组，第一个元素是 response 拦截器，第二个元素是错误处理
    [
      (response: AxiosResponse) => {
        // console.log('响应结果', response?.data)

        return response
      },
      (error: any) => {
        console.log('响应错误', error?.response)
        const res = error?.response
        // switch (res?.data?.code) {
        //   case '1003':
        //     console.log('执行了')
        //     history.push('/login')
        //     // message.error(res?.data?.msg)
        //     break
        // }
        switch (res?.status) {
          case 401:
            history.push('/403')
            break
          case 403:
            history.push('/403')
            break
          case 404:
            history.push('/404')
            break
          case 500:
            history.push('/500')
            break
          case 502:
            history.push('/500')
            break
          case 503:
            history.push('/500')
            break
        }
        return Promise.reject(error)
      }
    ]
  ]
}
export default (url: string, opt = requestConfig) => {
  const token = storage.getSession('token') || ''

  // 配置请求头
  opt.headers = {
    ...opt.headers,
    Authorization: token ? `Bearer ${token}` : ''
  }

  if (opt.headers?.isDisabledToken) {
    delete opt.headers.Authorization
    delete opt.headers.isDisabledToken
  }
  // console.log('请求头信息', opt)

  const customConfig = {
    ...opt
  }
  return request(url, { ...requestConfig, ...customConfig })
}
