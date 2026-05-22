import { http } from '@/utils'
import { env } from '@/config/env'
import { ILogListParams } from '../types/log'

export default {
  getList(params?: ILogListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/operation-logs`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/operation-logs/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/operation-logs/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  }
}
