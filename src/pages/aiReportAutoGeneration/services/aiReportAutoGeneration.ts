import { http } from '@/utils'
import { env } from '@/config/env'
import { IAddParams, IDetailParams } from '../types/aiReportAutoGeneration'

export default {
  getDetail(params: IDetailParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/datas/${params.id}`, {
      headers: {
        isDisabledToken: true,
        Authorization: params.token
      }
    }).then((response) => {
      return response
    })
  },
  upload(params: IAddParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${params.id}/auto`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  }
}
