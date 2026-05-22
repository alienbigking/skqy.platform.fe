import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IListParams,
  ISubmitParams,
  IUpdateParams
} from '../types/reportAndAnalysis'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/realtime-ecg/datas`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  // add(params: IAddParams) {
  //   return http(`${env.HOST_API_URL}yxpt/sys/outer-businesses`, {
  //     method: 'POST',
  //     data: params
  //   }).then((response) => {
  //     return response
  //   })
  // },
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  submit(params: ISubmitParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/reports/${params.id}/submit`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  }
  // delete(id: number) {
  //   return http(`${env.HOST_API_URL}yxpt/sys/outer-businesses/${id}`, {
  //     method: 'DELETE'
  //   }).then((response) => {
  //     return response
  //   })
  // }
}
