import { IPagination } from '@/pages/common/types/common'

interface IAddParams {
  name: string
  header: string
  organizationId: number
  innerBusinessId: number
  sort: number
  remark: string
}

interface IUpdateParams {
  id: number
  name: string
  header: string
  organizationId: number
  innerBusinessId: number
  sort: number
  remark: string
}

interface IListParams extends IPagination {
  name?: string
  organizationId?: number
}

interface IUploadDynamicAnalysisParams {
  id?: string
  conclusion?: string
  positive?: string
  positiveLevel?: string
  file: File
}

interface IUploadHealthAnalysisParams {
  id?: string
  conclusion?: string
  positive?: string
  positiveLevel?: string
  file: File
}

interface IHistoricalConclusionParams {
  id: string
}

interface IAIReportAnalysisParams {
  id: string
  type?: number
  ossId?: string
}

interface IApplyIssuanceAiReportParams {
  id: string
}

interface IApplyIssuanceNlDynamicReportParams {
  id: string
  productId: string
}

interface IAllOrganizationProductParams {
  organizationId: string
}

export {
  IAddParams,
  IListParams,
  IUpdateParams,
  IUploadDynamicAnalysisParams,
  IUploadHealthAnalysisParams,
  IHistoricalConclusionParams,
  IAIReportAnalysisParams,
  IApplyIssuanceAiReportParams,
  IApplyIssuanceNlDynamicReportParams,
  IAllOrganizationProductParams
}
