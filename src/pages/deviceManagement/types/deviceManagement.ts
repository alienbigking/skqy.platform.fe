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

export { IAddParams, IListParams, IUpdateParams }
