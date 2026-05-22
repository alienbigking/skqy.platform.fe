import { IPagination } from '@/pages/common/types/common'

interface IAddParams {}

interface IUpdateParams {
  id: number
  name: string
  remark: string
}

interface IListParams extends IPagination {
  name?: string
}

interface IRankingListParams {
  startTime: string
  endTime: string
}

interface ISummaryListParams {
  startTime: string
  endTime: string
}

interface IOverviewListParams {}

interface IImmediatePositiveWarnListParams {
  startTime: string
  endTime: string
}

interface IPositiveProportionListParams {
  startTime: string
  endTime: string
}

interface ISeverePositiveListParams {
  startTime: string
  endTime: string
}

export {
  IAddParams,
  IListParams,
  IUpdateParams,
  IRankingListParams,
  ISummaryListParams,
  IOverviewListParams,
  IImmediatePositiveWarnListParams,
  IPositiveProportionListParams,
  ISeverePositiveListParams
}
