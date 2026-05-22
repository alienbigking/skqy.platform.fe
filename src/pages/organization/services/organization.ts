import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IAddPdfNumberParams,
  IBatchAddAssignDeviceParams,
  IBatchAssignedDeviceIdsParams,
  IBatchAssignedDeviceListParams,
  IBatchUpdateAssignDeviceParams,
  IListParams,
  IPdfNumberListParams,
  IReducePdfNumberParams,
  IUpdateParams,
  IUpdatePdfNumberEnabledState
} from '../types/organization'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/organizations`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/organizations/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  getPdfNumberList(params?: IPdfNumberListParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/organizations/${params?.id}/quota/logs`,
      {
        params: params
      }
    ).then((response) => {
      return response
    })
  },
  getBatchAssignedDeviceList(params?: IBatchAssignedDeviceListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/allocations`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getAssignedDeviceDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/allocations/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  getBatchAssignedDeviceIds(params?: IBatchAssignedDeviceIdsParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/allocations/ids`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  addPdfNumber(params: IAddPdfNumberParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/organizations/${params?.id}/quota/increase`,
      {
        method: 'POST',
        data: params
      }
    ).then((response) => {
      return response
    })
  },
  batchAddAssignDevice(params: IBatchAddAssignDeviceParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/allocations`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  reducePdfNumber(params: IReducePdfNumberParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/organizations/${params?.id}/quota/decrease`,
      {
        method: 'POST',
        data: params
      }
    ).then((response) => {
      return response
    })
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/organizations`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/organizations/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  updatePdfNumberEnabledState(params: IUpdatePdfNumberEnabledState) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/organizations/${params.id}/quota/enabled`,
      {
        method: 'PUT',
        data: params
      }
    ).then((response) => {
      return response
    })
  },
  batchUpdateAssignDevice(params: IBatchUpdateAssignDeviceParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/allocations/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  delete(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/organizations/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  },
  deleteAssignedDevice(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/allocations/${id}`, {
      method: 'DELETE'
    }).then((response) => {
      return response
    })
  }
}
