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
  header?: string
  innerBusinessId?: string
  organizationId?: string
  remark?: string
}

export { IAddParams, IListParams, IUpdateParams }
