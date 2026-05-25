import { IPagination } from '@/pages/common/types/common'

interface IAddParams {
  parentId?: string
  name: string
  code: string
  ordinal?: number
  description?: string
}

interface IUpdateParams extends IAddParams {}

interface IListParams extends IPagination {
  name?: string
  code?: string
  tree?: boolean
}

export { IAddParams, IListParams, IUpdateParams }
