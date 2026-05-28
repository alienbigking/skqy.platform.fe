import { http } from '@/utils'
import { env } from '@/config/env'
import { IClientParams, IListParams } from '../types/oauthClient'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}oauth/clients`, {
      params
    }).then((response) => response)
  },
  getDetail(id: string) {
    return http(`${env.HOST_API_URL}oauth/client/${id}`).then(
      (response) => response
    )
  },
  add(params: IClientParams) {
    return http(`${env.HOST_API_URL}oauth/client`, {
      method: 'POST',
      data: params
    }).then((response) => response)
  },
  update(id: string, params: IClientParams) {
    return http(`${env.HOST_API_URL}oauth/client/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  },
  delete(id: string) {
    return http(`${env.HOST_API_URL}oauth/client/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  }
}
