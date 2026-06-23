import { http } from '@/utils'
import { env } from '@/config/env'
import { IWallpaperListParams, IWallpaperRecord } from '../types/wallpapers'

const baseUrl = `${env.HOST_API_URL}api/deepTab/admin/wallpapers`

export default {
  getList(params?: IWallpaperListParams) {
    return http(baseUrl, { params }).then((response) => response)
  },
  add(params: Partial<IWallpaperRecord>) {
    return http(baseUrl, {
      method: 'POST',
      data: params
    }).then((response) => response)
  },
  initDefaults() {
    return http(`${baseUrl}/defaults/init`, {
      method: 'POST'
    }).then((response) => response)
  },
  update(id: string, params: Partial<IWallpaperRecord>) {
    return http(`${baseUrl}/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  },
  delete(id: string) {
    return http(`${baseUrl}/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  }
}
