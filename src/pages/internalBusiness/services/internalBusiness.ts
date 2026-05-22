import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IListParams,
  ITypeListParams,
  IUpdateParams
} from '../types/internalBusiness'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/inner-businesses`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getAllList() {
    return http(`${env.HOST_API_URL}yxpt/sys/inner-businesses/list`).then(
      (response) => {
        return response
      }
    )
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/inner-businesses/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/inner-businesses`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/inner-businesses/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/inner-businesses/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  getTypeList(params?: ITypeListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/inner-businesses`, {
      params: params
    }).then((response) => {
      return response
    })
  }
}
