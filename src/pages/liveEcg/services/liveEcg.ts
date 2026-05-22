import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IListParams,
  ILiveUserListParams,
  ISetThresholdParams,
  IUpdateSetThresholdParams
} from '../types/liveEcg'

export default {
  getList(params?: IListParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/online-customers/ecg/monitorings/latest`,
      {
        params: params
      }
    ).then((response) => {
      return response
    })
  },
  getDetail(id: string) {
    return http(`${env.HOST_API_URL}yxpt/sys/ecg/monitorings/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  getLiveUserList(params?: ILiveUserListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/realtime-customers`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getSetCenter(params?: ISetThresholdParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/users/config`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  updateSetThreshold(params: IUpdateSetThresholdParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/users/config`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  }
}
