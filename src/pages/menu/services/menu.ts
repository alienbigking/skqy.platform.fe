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
    return http(`${env.HOST_API_URL}menu/menus`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}menu/menus/${id}`).then((response) => {
      return response
    })
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}menu/menus`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(params: IUpdateParams) {
    return http(`${env.HOST_API_URL}menu/menus/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}menu/menus/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  getMenuListByType(params?: IMenuListByType) {
    return http(`${env.HOST_API_URL}menu/menus/types`, {
      params: params
    }).then((response) => {
      return response
    })
  }
}
