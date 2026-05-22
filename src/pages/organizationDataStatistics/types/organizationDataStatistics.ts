import { IPagination } from '@/pages/common/types/common'

interface IAddParams {}

interface IUpdateParams {
  id: number
  name: string
  remark: string
}

interface IListParams extends IPagination {
  organizationName?: string
  endDate?: string
  reportType?: string
  startDate?: string
}

interface IAllListParams {}

export { IAddParams, IListParams, IUpdateParams, IAllListParams }
