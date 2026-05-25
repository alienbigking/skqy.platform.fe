import { http } from '@/utils'
import { env } from '@/config/env'
import { IListParams, ISendParams } from '../types/email'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}emails`, {
      params
    }).then((response) => response)
  },
  getDetail(id: string) {
    return http(`${env.HOST_API_URL}email/${id}`).then((response) => response)
  },
  send(params: ISendParams) {
    return http(`${env.HOST_API_URL}email/send`, {
      method: 'POST',
      data: params
    }).then((response) => response)
  },
  delete(id: string) {
    return http(`${env.HOST_API_URL}email/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  }
}
