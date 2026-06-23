import { http } from '@/utils'
import { env } from '@/config/env'
import { IFeedbackListParams } from '../types/feedback'

const baseUrl = `${env.HOST_API_URL}api/deepTab/admin/feedbacks`

export default {
  getList(params?: IFeedbackListParams) {
    return http(baseUrl, {
      params
    }).then((response) => response)
  },
  getDetail(id: string) {
    return http(`${baseUrl}/${id}`).then((response) => response)
  },
  update(id: string, params: { status?: string; adminRemark?: string }) {
    return http(`${baseUrl}/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  }
}
