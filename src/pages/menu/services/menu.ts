import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IMenuListByType,
  IMenuListParams,
  IUpdateParams
} from '../types/menu'

export default {
  getList(params?: IMenuListParams) {
    console.log('传入的参数', params)
    return http(`${env.HOST_API_URL}yxpt/sys/menus`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/menus/${id}`).then((response) => {
      return response
    })
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/menus`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/menus/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/menus/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  getMenuListByType(params?: IMenuListByType) {
    return http(`${env.HOST_API_URL}yxpt/sys/menus/types`, {
      params: params
    }).then((response) => {
      return response
    })
  }
}
