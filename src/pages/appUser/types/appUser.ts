import { IPagination } from '@/pages/common/types/common'

interface IAddParams {}

interface IUpdateParams {
  id: number
  name: string
  remark: string
}

interface IParamsHistory extends IPagination {
  id: string
  startTime?: string
  endTime?: string
  conditions?: string
}

interface IListParams extends IPagination {
  name?: string
}

interface IHeartRateList {
  id?: string
  startTime?: string
  endTime?: string
}

interface IGivenAiReportNumberParams {
  id: string
  productId: string
  type?: number
  count?: number
}

export {
  IAddParams,
  IListParams,
  IUpdateParams,
  IParamsHistory,
  IHeartRateList,
  IGivenAiReportNumberParams
}
