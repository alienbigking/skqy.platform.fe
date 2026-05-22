import { http } from '@/utils'
import { env } from '@/config/env'
import {
  IAIReportAnalysisParams,
  IAllOrganizationProductParams,
  IApplyIssuanceAiReportParams,
  IApplyIssuanceNlDynamicReportParams,
  IHistoricalConclusionParams,
  IListParams,
  IUpdateParams,
  IUploadDynamicAnalysisParams,
  IUploadHealthAnalysisParams
} from '../types/reportAnalysis'

export default {
  getList(params?: IListParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  getDetail(id: number) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${id}`).then(
      (response) => {
        return response
      }
    )
  },
  getAllOrganizationProduct(params?: IAllOrganizationProductParams) {
    return http(
      `${env.HOST_API_URL}yxpt/sys/organization-product-configs/all`,
      {
        params: params
      }
    ).then((response) => {
      return response
    })
  },
  update(id: string, params: IUpdateParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${id}`, {
      method: 'PUT',
      data: params
    }).then((response) => {
      return response
    })
  },
  uploadDynamicAnalysis(params: IUploadDynamicAnalysisParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${params.id}/dynamic`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  uploadHealthAnalysis(params: IUploadHealthAnalysisParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${params.id}/health`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  getHistoricalConclusion(params: IHistoricalConclusionParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${params.id}/history`, {
      params: params
    }).then((response) => {
      return response
    })
  },
  uploadAIReportAnalysis(params: IAIReportAnalysisParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/analysis/${params.id}/dynamic`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  applyIssuanceAiReport(params: IApplyIssuanceAiReportParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/reports/lepu/apply`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  },
  applyIssuanceNlDynamicReport(params: IApplyIssuanceNlDynamicReportParams) {
    return http(`${env.HOST_API_URL}yxpt/ecg/reports/nalong/apply`, {
      method: 'POST',
      data: params
    }).then((response) => {
      return response
    })
  }
}
