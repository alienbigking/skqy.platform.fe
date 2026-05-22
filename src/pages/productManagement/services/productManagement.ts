import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IListParams,
  IUpdateParams
} from '../types/productManagement'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/products`, {
      params: params
    }).then((response) => {
      return response
    })
  },

  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/products/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/products`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/products/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/products/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  }
}
