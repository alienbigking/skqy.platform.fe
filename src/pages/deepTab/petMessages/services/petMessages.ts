import { env } from '@/config/env'
import { http } from '@/utils'
import type {
  IDeepTabPetMessage,
  IPetMessageListParams
} from '../types/petMessages'

const baseUrl = `${env.HOST_API_URL}api/deepTab/admin/pet/messages`

export default {
  getList(params?: IPetMessageListParams) {
    return http(baseUrl, { params })
  },
  add(params: Partial<IDeepTabPetMessage>) {
    return http(baseUrl, { method: 'POST', data: params })
  },
  update(id: string, params: Partial<IDeepTabPetMessage>) {
    return http(`${baseUrl}/${id}`, { method: 'PUT', data: params })
  },
  publish(id: string) {
    return http(`${baseUrl}/${id}/publish`, { method: 'PUT' })
  },
  offline(id: string) {
    return http(`${baseUrl}/${id}/offline`, { method: 'PUT' })
  },
  delete(id: string) {
    return http(`${baseUrl}/${id}`, { method: 'DELETE' })
  }
}
