import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IListParams,
  IUpdateParams
} from '../types/permission'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}permissions`, {
      params
    }).then((response) => response)
  },
  getDetail(id: string) {
    return http(`${env.HOST_API_URL}permission/${id}`).then(
      (response) => response
    )
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}permission`, {
      method: 'POST',
      data: params
    }).then((response) => response)
  },
  update(id: string, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}permission/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  },
  delete(id: string) {
    return http(`${env.HOST_API_URL}permission/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  }
}
