import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAddParams,
  IImmediatePositiveWarnListParams,
  IListParams,
  IOverviewListParams,
  IPositiveProportionListParams,
  IRankingListParams,
  ISeverePositiveListParams,
  ISummaryListParams,
  IUpdateParams
} from '../types/workbench'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/roles`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getRankingList(params?: IRankingListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/statistics/online-ranking`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getSummaryList(params?: ISummaryListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/statistics/online-users-summary`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getOverviewList(params?: IOverviewListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/statistics/overview`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getImmediatePositiveWarnList(params?: IImmediatePositiveWarnListParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/statistics/positive-events-date`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getPositiveProportionList(params?: IPositiveProportionListParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/statistics/positive-events-summary`,
      {
        params: params
      }
    ).then((response) => {
      return response
    })
  },
  getSeverePositiveList(params?: ISeverePositiveListParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/statistics/serious-positive-events-summary`,
      {
        params: params
      }
    ).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/sys/roles/${id}`).then((response) => {
      return response
    })
  },
  add(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/roles`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/roles/${id}`, {
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
  }
}
