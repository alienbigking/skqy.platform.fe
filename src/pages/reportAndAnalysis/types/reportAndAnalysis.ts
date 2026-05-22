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

interface ISubmitParams {
  id: string
  type: number
}

interface IListParams extends IPagination {
  name?: string
  organizationId?: number
}

export { IAddParams, IListParams, IUpdateParams, ISubmitParams }
