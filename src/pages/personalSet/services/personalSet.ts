import { http } from '@/utils'
import { env } from '@/config/env'
import { IUpdateParams } from '../types/personalSet'

export default {
  update(id: number, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/sys/roles/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  }
}
