import { http } from '@/utils'
import { env } from '@/config/env'
import type { Entity, IListParams } from '../types/wallet'
const base = `${env.HOST_API_URL}api/qianBaoMD/admin`
export default {
  list(entity: Entity, params: IListParams) {
    return http(`${base}/${entity}`, { params })
  },
  handle(entity: Entity, id: string, data: { status: string; remark: string }) {
    return http(`${base}/${entity}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      data
    })
  },
  disable(userId: string) {
    return http(`${base}/users/${encodeURIComponent(userId)}/disable`, {
      method: 'PUT'
    })
  },
  imageUrl(url: string) {
    return url.startsWith('/uploads/')
      ? `${env.HOST_API_URL.replace(/\/$/, '')}${url}`
      : url
  }
}
