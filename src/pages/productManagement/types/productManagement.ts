import { IPagination } from '@/pages/common/types/common'

interface IAddParams {}

interface IUpdateParams {
  id: number
  name: string
  remark: string
}

interface IListParams extends IPagination {
  name?: string
  categoryCode?: string
  categoryCodes?: string
  categoryId?: string
  productIdentifiers?: string
  productIdentifier?: string
  productType?: string
  sourceProvider?: string
  status?: number
}

interface IAllListParams {}

export { IAddParams, IListParams, IUpdateParams, IAllListParams }
