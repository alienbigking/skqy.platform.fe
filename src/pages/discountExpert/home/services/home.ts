import { http } from '@/utils'
import { env } from '@/config/env'
import {
  ICreateHomeEntryParams,
  IHomeEntryListParams,
  IHomeConfigResponse,
  IUpdateHomeEntryParams
} from '../types/home'

const baseUrl = `${env.HOST_API_URL}api/discountExpert/home`

export default {
  getConfig(params?: IHomeEntryListParams) {
    return http<IHomeConfigResponse>(`${baseUrl}/config`, {
      params
    }).then((response) => response.data)
  },
  getList(params?: IHomeEntryListParams) {
    return http(`${baseUrl}/entries`, {
      params
    }).then((response) => response)
  },
  add(params: ICreateHomeEntryParams) {
    return http(`${baseUrl}/entries`, {
      method: 'POST',
      data: params
    }).then((response) => response)
  },
  update(params: IUpdateHomeEntryParams) {
    return http(`${baseUrl}/entries/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  },
  delete(id: string) {
    return http(`${baseUrl}/entries/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  }
}
