import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IBindParams,
  IHeartRateList,
  IListParams,
  IParamsHistory,
  ISetTimeParams,
  IUnbindParams,
  IUpdateParams,
  IUserInfoParams
} from '../types/miniProgramUser'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/customers`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getHistory(params?: IParamsHistory) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/customers/${params?.id}/ecg/monitorings`,
      {
        params: params
      }
    ).then((response) => {
      return response
    })
  },
  getHeartRateList(params?: IHeartRateList) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/customers/${params?.id}/heart-rate-trend`,
      {
        params: params
      }
    ).then((response) => {
      return response
    })
  },
  getUserInfo(params?: IUserInfoParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/management/users/${params?.id}`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/management/users`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/management/users/${params?.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/roles/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  setTime(params: ISetTimeParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/customers/${params.id}/submit-analysis`,
      {
        method: 'POST',
        data: params
      }
    ).then((response) => {
      return response
    })
  },
  bind(params: IBindParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/management/users/${params?.id}/devices`,
      {
        method: 'POST',
        data: params
      }
    ).then((response) => {
      return response
    })
  },
  unbind(params: IUnbindParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/management/users/${params?.id}/devices`,
      {
        method: 'DELETE'
      }
    ).then((response) => {
      return response
    })
  }
}
