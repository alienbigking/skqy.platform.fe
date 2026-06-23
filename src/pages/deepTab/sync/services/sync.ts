import { http } from '@/utils'
import { env } from '@/config/env'
import { ISyncListParams } from '../types/sync'

const baseUrl = `${env.HOST_API_URL}api/deepTab/admin/sync`

export default {
  getList(params?: ISyncListParams) {
    return http(baseUrl, { params }).then((response) => response)
  },
  getDetail(id: string) {
    return http(`${baseUrl}/${id}`).then((response) => response)
  },
  delete(id: string) {
    return http(`${baseUrl}/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  }
}
