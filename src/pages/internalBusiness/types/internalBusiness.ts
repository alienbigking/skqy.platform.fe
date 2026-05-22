import { IPagination } from '@/pages/common/types/common'

interface IAddParams {
  name: string
  sort?: number
  remark?: string
}

interface IUpdateParams {
  id: number
  name: string
  sort?: number
  remark?: string
}

interface IListParams extends IPagination {
  name?: string
  remark?: string
}

interface ITypeListParams {}

export { IAddParams, IListParams, IUpdateParams, ITypeListParams }
