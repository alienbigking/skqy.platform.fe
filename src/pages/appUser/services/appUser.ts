import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IGivenAiReportNumberParams,
  IListParams,
  IUpdateParams
} from '../types/appUser'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/customers/app-users`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id?: string) {
    return http(`${env.HOST_API_URL}yxpt/sys/customers/${id}/app-users`).then(
      (response) => {
        return response
      }
    )
  },
  update(params: IUpdateParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/customers/${params.id}/app-users`,
      {
        method: 'PUT',
        data: params
      }
    ).then((response) => {
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
  givenAiReportNumber(params: IGivenAiReportNumberParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/customers/${params.id}/report-attempts`,
      {
        method: 'POST',
        data: params
      }
    ).then((response) => {
      return response
    })
  }
}
