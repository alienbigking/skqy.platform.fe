import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IAllListParams,
  IListParams,
  IUpdateParams
} from '../types/role'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}roles`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getAllList(params?: IAllListParams) {
    return http(`${env.HOST_API_URL}roles/list`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}role/${id}`).then((response) => {
      return response
    })
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}role`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}role/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}role/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  }
}
