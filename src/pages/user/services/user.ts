import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAssignedIds,
  IAssignParams,
  IListParams,
  IUserAddParams
} from '../types/user'
import { IUpdateParams } from '@/pages/user/types/user'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/users`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/users/${id}`).then((response) => {
      return response
    })
  },
  add(params: IUserAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/users`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/users/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/users/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  enable(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/users/${id}/enable`, {
      method: 'PUT'
    }).then((response) => {
      return response
    })
  },
  disabled(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/users/${id}/disable`, {
      method: 'PUT'
    }).then((response) => {
      return response
    })
  },
  assign(params: IAssignParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/users/${params.id}/assign-operator`,
      {
        method: 'POST',
        data: params
      }
    ).then((response) => {
      return response
    })
  },
  getAssignedIds(params: IAssignedIds) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/users/${params.id}/assigned-ids`
    ).then((response) => {
      return response
    })
  }
}
