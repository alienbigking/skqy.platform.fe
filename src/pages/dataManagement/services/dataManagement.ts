import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IListParams,
  IUpdateAssignDynamicDoctorParams,
  IUpdateAssignHealthDoctorParams,
  IUpdateParams
} from '../types/organizationBusiness'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/datas`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/ecg/datas/${id}`).then((response) => {
      return response
    })
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/datas`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/datas/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/ecg/datas/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  updateAssignDynamicDoctor(params: IUpdateAssignDynamicDoctorParams) {
    return http(
      `${env.HOST_API_URL}yxpt/ecg/datas/dynamic-assign/${params.id}`,
      {
        method: 'PUT',
        data: params
      }
    ).then((response) => {
      return response
    })
  },
  updateAssignHealthDoctor(params: IUpdateAssignHealthDoctorParams) {
    return http(
      `${env.HOST_API_URL}yxpt/ecg/datas/health-assign/${params.id}`,
      {
        method: 'PUT',
        data: params
      }
    ).then((response) => {
      return response
    })
  }
}
