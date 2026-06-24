import { http } from '@/utils'
import { env } from '@/config/env'
import { IDeepTabNotification, INotificationListParams } from '../types/notifications'

const baseUrl = `${env.HOST_API_URL}api/deepTab/admin/notifications`

export default {
  getList(params?: INotificationListParams) {
    return http(baseUrl, { params }).then((response) => response)
  },
  add(params: Partial<IDeepTabNotification>) {
    return http(baseUrl, {
      method: 'POST',
      data: params
    }).then((response) => response)
  },
  update(id: string, params: Partial<IDeepTabNotification>) {
    return http(`${baseUrl}/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  },
  publish(id: string) {
    return http(`${baseUrl}/${id}/publish`, {
      method: 'PUT'
    }).then((response) => response)
  },
  offline(id: string) {
    return http(`${baseUrl}/${id}/offline`, {
      method: 'PUT'
    }).then((response) => response)
  },
  delete(id: string) {
    return http(`${baseUrl}/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  }
}
