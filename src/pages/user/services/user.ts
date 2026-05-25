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
    return http(`${env.HOST_API_URL}users`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: string) {
    return http(`${env.HOST_API_URL}users/${id}`).then((response) => {
      return response
    })
  },
  add(params: IUserAddParams) {
    return http(`${env.HOST_API_URL}users`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(params: IUpdateParams) {
    return http(`${env.HOST_API_URL}users/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: string) {
    return http(`${env.HOST_API_URL}users/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  enable(id: string) {
    return http(`${env.HOST_API_URL}users/${id}/enable`, {
      method: 'PUT'
    }).then((response) => {
      return response
    })
  },
  disabled(id: string) {
    return http(`${env.HOST_API_URL}users/${id}/disable`, {
      method: 'PUT'
    }).then((response) => {
      return response
    })
  },
  assign(params: IAssignParams) {
    return http(
      `${env.HOST_API_URL}users/${params.id}/assign-operator`,
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
      `${env.HOST_API_URL}users/${params.id}/assigned-ids`
    ).then((response) => {
      return response
    })
  },
  assignRole(userId: string, roleId: string) {
    return http(`${env.HOST_API_URL}${userId}/role`, {
      method: 'POST',
      data: { roleId }
    })
  },
  removeRole(userId: string, roleId: string) {
    return http(`${env.HOST_API_URL}${userId}/role/${roleId}`, {
      method: 'DELETE'
    })
  }
}
