import { http } from '@/utils'
import { env } from '@/config/env'
import { IListParams, IUpdateParams } from '../types/file'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}files`, {
      params
    }).then((response) => response)
  },
  upload(file: File, describe?: string) {
    const formData = new FormData()
    formData.append('file', file)
    return http(`${env.HOST_API_URL}file`, {
      method: 'POST',
      headers: {
        'Content-type': 'multipart/form-data'
      },
      params: {
        describe
      },
      data: formData
    }).then((response) => response)
  },
  update(params: IUpdateParams) {
    return http(`${env.HOST_API_URL}file/${params.id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  },
  delete(id: string) {
    return http(`${env.HOST_API_URL}file/${id}`, {
      method: 'DELETE'
    }).then((response) => response)
  },
  getDownloadUrl(id: string) {
    return http(`${env.HOST_API_URL}files/${id}/download-url`).then(
      (response) => response
    )
  }
}
