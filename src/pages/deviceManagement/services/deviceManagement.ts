import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IListParams,
  IUpdateParams
} from '../types/deviceManagement'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/devices`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/devices/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/devices`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  batchAdd(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/devices/batch`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/devices/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/devices/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  unbind(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/devices/${id}/unbind`, {
      method: 'POST'
    }).then((response) => {
      return response
    })
  }
}
