import { http } from '@/utils'
import { env } from '@/config/env'
import { IInvitationListParams } from '../types/invitations'

const baseUrl = `${env.HOST_API_URL}api/deepTab/admin/invitations`

export default {
  getList(params?: IInvitationListParams) {
    return http(baseUrl, { params }).then((response) => response)
  },
  getStats() {
    return http(`${baseUrl}/stats`).then((response) => response)
  },
  update(id: string, params: { inviteeStatus?: string; reward?: number }) {
    return http(`${baseUrl}/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => response)
  }
}
