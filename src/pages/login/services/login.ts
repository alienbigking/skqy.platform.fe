import { http } from '@/utils'
import { env } from '@/config/env'
import {
  ILoginParams,
  IRegisterParams,
  IResetPasswordParams,
  ISendCaptchaParams
} from '../types/login'

export default {
  get(id: number) {
    return http(`${env.HOST_API_URL}users/${id}`).then((response) => {
      return response.data
    })
  },
  register(params: IRegisterParams) {
    return http(`${env.HOST_API_URL}yxpt/register`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  login(params: ILoginParams) {
    return http(`${env.HOST_API_URL}yxpt/login`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  sendCaptcha(params: ISendCaptchaParams) {
    console.log('是否为json格式', params)
    return http(`${env.HOST_API_URL}yxpt/auth/send-captcha`, {
      method: 'POST',
      data: params
    }).then((response) => {
      console.log('结果', response)
      return response
    })
  },
  resetPassword(params: IResetPasswordParams) {
    return http(`${env.HOST_API_URL}yxpt/password/reset/confirm`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  }
  // getFile(params) {
  //   const params = { attachment: false, username: avatar }
  //   const responseType = 'blob'
  //   return request(`users/by-username/avatar`, {
  //     params: params,
  //     responseType: responseType
  //   })
  // }
  // add(params) {
  //   return request('users', user)
  // },
  // update(params) {
  //   return request(`users/${user.id}`, user)
  // },
  // delete(id: number) {
  //   return request(`users/${id}`)
  // }
}
